import SiteHeader from "@/components/SiteHeader";
import ProfileHeader from "@/components/ProfileHeader";
import PostGrid from "@/components/PostGrid";
import { getPosts, getProfile } from "@/lib/posts";

export const revalidate = 10;

export default async function HomePage() {
  const [posts, profile] = await Promise.all([getPosts(), getProfile()]);

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <ProfileHeader profile={profile} />
      <div className="h-8 sm:h-10" />
      <PostGrid posts={posts} />
    </main>
  );
}
