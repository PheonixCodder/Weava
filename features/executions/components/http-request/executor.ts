import { NodeExecutor } from "@/features/executions/type";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", function (context) {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "loading",
    })
  );

  if (!data.endpoint) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("HTTP Request node missing endpoint");
  }
  if (!data.variableName) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError(
      "Variable name is required for HTTP Request node"
    );
  }

  if (!data.method) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("HTTP Request node missing method");
  }

  try {
  const result = await step.run(`http-request`, async () => {
    const endpoint = Handlebars.compile(data.endpoint as string)(context);
    const method = data.method;

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method || "{}")) {
      const resolved = Handlebars.compile(data.body)(context);
      JSON.parse(resolved);
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
        ...data.headers,
      };
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
    return {
      ...context,
      [data.variableName as string]: responsePayload,
    };
  });

  await publish(
      httpRequestChannel().status({
        nodeId,
        status: "success",
      })
    );

  return result;
  } catch (error: any) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
        error: error?.message || "Unknown error",
      })
    );
    throw error;
  }
};
