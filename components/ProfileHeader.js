export default function ProfileHeader({ profile, postCount }) {
  const banner = profile?.banner_url;
  const avatar = profile?.avatar_url;
  const name = profile?.name || "Your Name";
  const email = profile?.email || "you@example.com";
  const bio = profile?.bio || "Welcome to my corner of the internet.";
  const followers = profile?.followers || "0";

  return (
    <section className="w-full flex flex-col items-center">
      <div className="w-full max-w-feed mx-auto px-0 sm:px-4">
        <div className="relative w-full h-40 sm:h-56 md:h-64 overflow-hidden bg-subtle sm:rounded-2xl">
          {banner ? (
            <img src={banner} alt="Profile banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#faf9f7] to-[#f0eef2]" />
          )}
        </div>
      </div>

      <div className="relative -mt-12 sm:-mt-14 md:-mt-16">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white bg-subtle overflow-hidden shadow-sm">
          {avatar ? (
            <img src={avatar} alt="Profile picture" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted font-handwritten text-2xl">
              P
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 px-6 flex flex-col items-center text-center max-w-md">
        <p className="text-[17px] text-ink font-bold tracking-tight">{name}</p>
        <p className="mt-1 text-[14px] text-muted">{email}</p>

        <div className="mt-4 flex items-center gap-10">
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-bold text-ink">{postCount}</span>
            <span className="text-[12.5px] text-muted">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-bold text-ink">{followers}</span>
            <span className="text-[12.5px] text-muted">Followers</span>
          </div>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-muted">{bio}</p>
      </div>
    </section>
  );
}
