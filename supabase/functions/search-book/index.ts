import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Search using Google Books API (free, no API key required)
    const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return new Response(
        JSON.stringify({ books: [], message: "No books found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const books = data.items.map((item: any) => {
      const volumeInfo = item.volumeInfo || {};
      return {
        id: item.id,
        title: volumeInfo.title || "Unknown Title",
        author: volumeInfo.authors?.join(", ") || "Unknown Author",
        pageCount: volumeInfo.pageCount || null,
        coverUrl: volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") || null,
        description: volumeInfo.description?.substring(0, 200) || null,
        publishedDate: volumeInfo.publishedDate || null,
      };
    });

    return new Response(
      JSON.stringify({ books }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error searching books:", error);
    return new Response(
      JSON.stringify({ error: "Failed to search books" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
