import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";

import { userSchema, usersListSchema, usersSummaryListSchema } from "@model/user.model.js";
import {
  fetchUsers,
  findUserByName,
  formatUserName,
  formatUserSummary,
  toUserSummary,
} from "@services/user-service.js";

const server = new McpServer({
  name: "Example server",
  version: "1.0.0",
});

const prompts = [
  {
    name: "get-users-names",
    title: "Get all users names",
    description: "Get all users names from the REST API",
    message: "Use tool to get all users names from the REST API",
  },
  {
    name: "get-specific-user-details",
    title: "Get specific user details",
    description: "Get specific user details from the REST API",
    message: "Use tool to get specific user details from the REST API",
  },
   {
    name: "get-available-user-details",
    title: "Get available user short summary details",
    description: "Get available user summary details from the REST API",
    message: "Use tool to get available user summary details from the REST API",
  },
] as const;

for (const prompt of prompts) {
  server.registerPrompt(
    prompt.name,
    {
      title: prompt.title,
      description: prompt.description,
    },
    () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: prompt.message,
          },
        },
      ],
    }),
  );
}

server.registerTool(
  "getAllUsers",
  {
    description: "Get all users",
    inputSchema: z.object({}),
    outputSchema: usersListSchema,
  },
  async () => {
    const users = await fetchUsers();

    return {
      content: [
        {
          type: "text",
          text: users.map(formatUserName).join(", "),
        },
      ],
      structuredContent: { users },
    };
  },
);

server.registerTool(
  "getSpecificUserDetails",
  {
    description: "Get specific user details",
    inputSchema: z.object({
      userName: z.string().describe("The name of the user to get"),
    }),
    outputSchema: userSchema,
  },
  async ({ userName }) => {
    const users = await fetchUsers();
    const user = findUserByName(users, userName);

    if (!user) {
      throw new Error(`User with name "${userName}" not found`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(user, null, 2),
        },
      ],
      structuredContent: user,
    };
  },
);

server.registerTool(
  "getAvailableUserDetails",
  {
    description: "Get available user summary details for all users",
    inputSchema: z.object({}),
    outputSchema: usersSummaryListSchema,
  },
  async () => {
    const users = await fetchUsers();
    const summaries = users.map(toUserSummary);

    return {
      content: [
        {
          type: "text",
          text: summaries.map(formatUserSummary).join("\n"),
        },
      ],
      structuredContent: { users: summaries },
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
