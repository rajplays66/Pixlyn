import PostCard from "./PostCard";

export default function PostGrid({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="w-full max-w-feed mx-auto px-6 py-20 flex flex-col items-center text-center">
        <p className="font-handwritten text-3xl text-ink mb-2">
          Nothing here yet
        </p>
        <p className="text-[14.5px] text-muted max-w-xs">
          Once you publish a post from the admin panel, it will appear here
          first.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-feed mx-auto px-3 sm:px-4 pb-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
