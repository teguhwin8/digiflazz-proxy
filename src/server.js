require("dotenv").config();
const fastify = require("fastify")();
const axios = require("axios");

fastify.get("/", async (request, reply) => {
  return "Hello World";
});

fastify.post("/*", async (request, reply) => {
  const path = request.params["*"];
  const digiflazzUrl =
    process.env.DIGIFLAZZ_URL || "https://api.digiflazz.com/v1";
  const fullUrl = `${digiflazzUrl}/${path}`;

  // Get method from query parameter, default to POST
  const method = (request.query.method || "POST").toUpperCase();

  try {
    const response = await axios({
      method: method,
      url: fullUrl,
      params: request.query,
      data: request.body,
      validateStatus: () => true,
    });

    reply.code(response.status);
    return response.data;
  } catch (error) {
    reply.code(500);
    return {
      error: error.message,
    };
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3006 });
    console.log("Server listening on http://127.0.0.1:3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
