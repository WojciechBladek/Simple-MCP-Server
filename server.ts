import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";

const server = new McpServer({
    name: "Example server",
    version: "1.0.0",
});


server.registerTool(
  "getAllUsers",
  {
    description: "Get specific user details",
    inputSchema: {
      userName: z.string().describe("The name of the user to get"),
    },
    outputSchema: z.object()
  },
  async ({ userName }) => {
    const response = await fetch("https://dummyjson.com/users");
    const json = await response.json();


  
    const user = json.users.find(
      (u: any) => u.firstName.toLowerCase().includes(userName.toLowerCase()) 
    );

    if (!user) {
      throw new Error(`User with username "${userName}" not found`);
    }


return {
      content: [
        {
          type: "text",
          text: JSON.stringify(user, null, 2),
        },
      ],
      structuredContent: user
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);