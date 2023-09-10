import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
export default function LoginPage({ providers }) {
  //LoginSession
  const { data, status } = useSession();

  const router = useRouter();
  if (status == "loading") {
    return "";
  }
  if (data) {
    router.push("/");
    const userId = data.user.id;
    localStorage.setItem("userId", userId);
  }
  //
  return (
    <div className="flex items-center justify-center h-screen">
      {Object.values(providers).map((provider) => (
        <div key={provider.id}>
          <button
            onClick={async () => {
              await signIn(provider.id);
            }}
            className="bg-twitterWhite py-2 text-black rounded-full flex items-center pl-3.5 pr-4"
          >
            <img src="/google.png" alt="" className="h-7 mr-1"></img>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
