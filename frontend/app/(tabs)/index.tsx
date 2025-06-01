// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/Feed" />; // or "/listings" or any valid tab/screen
}
