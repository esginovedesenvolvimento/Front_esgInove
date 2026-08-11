const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseBrowser = supabaseUrl && supabaseAnonKey
  ? {
      getRecoveryAccessToken() {
        if (typeof window === "undefined") return null;
        const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        if (params.get("type") !== "recovery") return null;
        const accessToken = params.get("access_token");
        if (accessToken) {
          window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        }
        return accessToken;
      },
      async updatePassword(accessToken: string, password: string) {
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          method: "PUT",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.msg ?? data?.message ?? "Não foi possível atualizar a senha");
        }
      },
    }
  : null;
