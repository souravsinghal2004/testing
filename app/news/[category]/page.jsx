import { NewsCard } from "@/components/News-Card";

export default async function NewsPage({ params }) {
  const category = params.category;

const res = await fetch(`/api/news/${category}`, {
  cache: "no-store",
});


  const data = await res.json();
  const articles = data.articles || [];

  return (
    <section>
      <h1 className="font-bold text-2xl ml-3 mb-4 text-white capitalize">
        {category} News
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((item) => (
            <NewsCard
              key={item.url}
              title={item.title}
              image={item.image}
              description={item.description}
              url={item.url}
              publishedAt={item.publishedAt}
              source={item.source?.name}
            />
          ))}
      </div>
    </section>
  );
}
