import AdminDashboard from "@/components/AdminDashboard";
import { getPosts, getProfile } from "@/lib/posts";

export default async function AdminPage() {
  const [posts, profile] = await Promise.all([getPosts(), getProfile()]);

  return <AdminDashboard initialPosts={posts} initialProfile={profile} />;
}
