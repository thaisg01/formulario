import { GlobalStyles as GS } from "@mui/material";

export default function GlobalStyles() {
  return (
    <GS
      styles={{
        body: {
          margin: "0", // Remove a margem do body
          padding: "0", // Remove o padding do body (se houver)
        },
      }}
    />
  );
}
 
