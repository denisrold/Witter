export const config = {
  runtime: "edge",
};

export default function handler(request) {
  const { searchParams } = new URL(request.url);

  return new Response(
    JSON.stringify({
      body: request.body,
      query: searchParams.get("query"),
      cookies: request.cookies,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
