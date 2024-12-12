import React, { ReactNode } from "react";
import { Box, Toolbar, Button as MuiButton } from "@mui/material";

// Definição do componente Botao
interface BotaoProps {
  texto?: string; // Texto opcional
  children?: React.ReactNode; // Suporte a children
  onClick?: () => void;
  href?: string; // Para links
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "success" | "error";
  fullWidth?: boolean;
  sx?: object;
}

const Botao: React.FC<BotaoProps> = ({
  texto,
  children,
  onClick,
  href,
  variant = "contained",
  color = "primary",
  fullWidth = false,
  sx = {},
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      onClick={onClick}
      href={href}
      fullWidth={fullWidth}
      sx={sx}
    >
      {texto || children}
    </MuiButton>
  );
};

// MenuVertical com uso do componente Botao
const MenuVertical = () => {
  return (
    <Box
      sx={{
        width: "240px",
        height: "210vh",
        bgcolor: "#e0e4e7", // Cor de fundo (azul)
        color: "#fff",
        padding: "16px",
      }}
    >
      <Toolbar />
      <Botao
        fullWidth
        sx={{ marginBottom: "8px" }}
        href="/cadastro"
        texto="Cadastrar Cliente"
      />
      <Botao fullWidth href="/clientes" texto="Lista de Clientes" />
    </Box>
  );
};

// Componente principal App
const App = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <MenuVertical />
      <Box
        sx={{
          flexGrow: 1,
          p: 4, // Padding interno
          backgroundColor: "#e0e4e7", // Fundo claro para contraste
          minHeight: "100vh", // Garante altura completa
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default App;
