import { getJwtFromCookie } from "@/_utils/cookie";

/**
 *
 * @param ueserId
 * @param token
 */
export async function addFavorite(userId: string): Promise<void> {
  try {
    const headers = await getJwtFromCookie();
    if (!headers) {
      throw new Error("No access_token cookie found");
    }

    const url = new URL(
      `/api/users/${userId}/favorite`,
      process.env.NEXT_PUBLIC_BASE_URL
    );
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${headers}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to create schedule");
    }

    const resJson = await res.json();
    if (resJson?.status != "ok") {
      throw new Error(resJson?.message || "Failed to create schedule");
    }
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw new Error("Failed to create schedule");
  }
}

/**
 *
 * @param ueserId
 * @param token
 */
export async function removeFavorite(userId: string): Promise<void> {
  try {
    const headers = await getJwtFromCookie();
    if (!headers) {
      throw new Error("No access_token cookie found");
    }

    const url = new URL(
      `/api/users/${userId}/favorite`,
      process.env.NEXT_PUBLIC_BASE_URL
    );
    const res = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${headers}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to create schedule");
    }

    const resJson = await res.json();
    if (resJson?.status != "ok") {
      throw new Error(resJson?.message || "Failed to create schedule");
    }
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw new Error("Failed to create schedule");
  }
}
