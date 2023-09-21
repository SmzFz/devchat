// Importação de módulos e componentes necessários
import style from "./join.module.css"; // Importa estilos CSS específicos para este componente
import { Input, Button } from "@mui/material"; // Importa componentes de entrada e botão do Material UI
import devLogo from "../../assets/devChat.png"; // Importa uma imagem do logo
import io from "socket.io-client"; // Importa a biblioteca socket.io-client para comunicação via WebSocket
import { useEffect, useRef } from "react"; // Importa hooks do React (useEffect e useRef)

// Definição do componente Join
const Join = ({ state, handShake }) => {
  // Cria uma ref para o input de username
  const usernameRef = useRef();

  // Efeito que faz o foco ser direcionado para o input de username ao carregar o componente
  useEffect(() => {
    usernameRef.current.focus();
  });

  // Função para lidar com o envio do nome de usuário
  const submit = async () => {
    const username = usernameRef.current.value;
    if (!username.trim()) return; // Verifica se o nome de usuário não está vazio ou apenas com espaços em branco
    const socket = await io.connect("http://localhost:3001"); // Conecta-se ao servidor WebSocket
    socket.emit("set_username", username); // Emite um evento "set_username" para configurar o nome de usuário no servidor
    handShake(socket); // Chama a função handShake passando o socket como argumento
    state(true); // Chama a função state passando true como argumento
  };

  // Função para lidar com a tecla Enter pressionada
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submit(); // Chama a função submit se a tecla Enter for pressionada
    }
  };

  // Renderização do componente
  return (
    <>
      <div className={style["dev-logo"]}>
        <img src={devLogo} alt="" /> {/* Exibe o logo do devChat */}
      </div>
      <div className={style["join-container"]}>
        <h2>Bem-vindo ao devChat</h2> {/* Título do componente */}

        <Input
          inputRef={usernameRef}
          placeholder="Nome de usuário..."
          onKeyDown={handleKeyPress} // Chama a função handleKeyPress quando uma tecla é pressionada
        />
        <Button
          sx={{ mt: 2, mb: 2 }}
          variant="contained"
          onClick={() => submit()} // Chama a função submit ao clicar no botão
        >
          {" "}
          Entrar
        </Button>
      </div>
    </>
  );
};

export default Join; // Exporta o componente Join para uso em outros lugares do aplicativo
