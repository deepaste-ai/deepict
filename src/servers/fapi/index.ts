import 'server-only';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGroq } from '@ai-sdk/groq';
import { zValidator } from '@hono/zod-validator';
import { streamText } from 'ai';
import dedent from 'dedent';
import { Hono } from 'hono';
import { except } from 'hono/combine';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { streamSSE } from 'hono/streaming';
import { z } from 'zod/v4';

/** FAPI服务器实例，基础路径为 /fapi */
const fapiServer = new Hono().basePath('/fapi');
// === 中间件配置 ===

/** 请求日志中间件 */
fapiServer.use(logger());

/**
 * 压缩中间件 - 排除SSE流
 * 对于Server-Sent Events，不能启用压缩，因为需要实时传输
 */
fapiServer.use(
  '*',
  except((c) => {
    return c.req.header().accept?.includes('text/event-stream');
  }, compress()),
);

/**
 * CORS中间件 - 允许跨域请求
 * 配置为允许所有来源，适用于开发环境
 */
fapiServer.use(
  '*',
  cors({
    origin: (origin) => origin || '*',
    allowHeaders: ['*'],
    exposeHeaders: ['*'],
    credentials: true,
  }),
);

fapiServer.post(
  '/gen-vis-comp',
  zValidator(
    'json',
    z.object({
      prevHTML: z.string().optional(),
      json: z.string(),
      userInput: z.string().optional(),
      apiKey: z.string().optional(),
      apiProvider: z.enum(['anthropic', 'groq']).optional(),
    }),
  ),
  async (c) => {
    const { prevHTML, json, userInput, apiKey: requestApiKey, apiProvider = 'anthropic' } = c.req.valid('json');

    let model;

    if (apiProvider === 'groq') {
      const groqApiKey = requestApiKey || process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        return c.json({ error: 'API key is required. Please configure your Groq API key in settings.' }, 400);
      }

      const groq = createGroq({
        apiKey: groqApiKey,
      });
      model = groq('moonshotai/kimi-k2-instruct');
    } else {
      const anthropicApiKey = requestApiKey || process.env.ANTHROPIC_API_KEY;
      if (!anthropicApiKey) {
        return c.json({ error: 'API key is required. Please configure your Anthropic API key in settings.' }, 400);
      }

      const anthropic = createAnthropic({
        apiKey: anthropicApiKey,
      });
      model = anthropic('claude-4-sonnet-20250514');
    }

    const abortController = new AbortController();
    const { signal: abortSignal } = abortController;
    return streamSSE(
      c,
      async (stream) => {
        try {
          stream.onAbort(() => {
            abortController.abort();
          });
          if (!userInput) {
            await stream.writeSSE({
              data: JSON.stringify({
                type: 'resp',
                content: 'Received new JSON data, generating first visualization component...\n',
              }),
            });
          }
          const result = streamText({
            model: model,
            system: `你是一个擅长数据分析的前端可视化大师，擅长将结构化数据转为可视化的 HTML UI 组件。
            你总是会先洞察用户发送的JSON数据，理解数据的含义，参考用户的要求，完成可视化组件的设计。

            1. 当用户没有任何样式要求的时候，可以使用如下默认风格：
              - 使用 cdn(https://cdn.jsdelivr.net/npm/shadcn-ui@0.9.5/dist/index.min.js) 引入 shadcn 的样式，并默认使用深色模式
              - 使用符合 Apple 标准的风格视觉设计，使用黑色 + 单一主色，保持元素的高级感
              - 默认使用轻拟物风格
              - 强调超大字体或数字突出核心要点，画面中有超大视觉元素强调重点，与小元素的比例形成反差
              - 中英文混用，中文大字体粗体，英文小字作为点缀
              - 运用高亮色自身透明度渐变制造科技感，但是不同高亮色不要互相渐变
              - 数据可以引用在线的图表组件，样式需要跟主题一致
            2. 当用户没有特殊要求时，最多默认考虑 Top 3 level 的数据，避免数据主次不清
            3. 对于高价值数据，可以考虑同时使用 chart 和 table 来表达数据的深层含义
            4. 当数据量过多时，需要根据逻辑关系，按照重要性降序布局
            `,
            prompt: dedent`
            这是结构化的JSON数据:
            ${JSON.stringify(JSON.parse(json), null, 4)}

            上一个版本生成的HTML:
            ${prevHTML ? `${prevHTML}` : '无'}

            请根据上面的JSON和之前版本生成的HTML${
              userInput ? `并根据用户的需求: ${userInput}` : ''
            }产生一个用于渲染这个JSON的可视化HTML组件。
            !!!注意!!!仅返回给我生成的HTML即可，不要用markdown的block包裹
            声明渲染JSON的地方请使用特殊的占位符 我会在后续通过替换将实际要渲染的JSON替换进去 请遵循这样的结构: const renderJSON = {†RENDER_JSON†}
            请在head的第一个script标签中就将renderJSON赋值给一个全局变量，并使用这个全局变量来渲染JSON。
            `,
            abortSignal,
            maxTokens: apiProvider === 'groq' ? 16384 : 64000,
          });
          for await (const part of result.fullStream) {
            switch (part.type) {
              case 'text-delta': {
                // handle text delta here
                await stream.writeSSE({
                  data: JSON.stringify({
                    type: 'html',
                    content: part.textDelta,
                  }),
                });
                break;
              }
              case 'reasoning': {
                // handle reasoning here
                break;
              }
              case 'finish': {
                // handle finish here
                break;
              }
              case 'error': {
                throw part.error;
              }
            }
          }
          await stream.writeSSE({
            data: JSON.stringify({
              type: 'resp',
              content: `Done. New component generated.`,
            }),
          });
        } catch (err: unknown) {
          console.error(err);
          await stream.writeSSE({
            event: 'error',
            data: (err as Error)?.message || 'Unknow Error',
          });
        }
      },
      async (err) => {
        console.error(err);
      },
    );
  },
);

export default fapiServer;
