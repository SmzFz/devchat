// Importação de estilos do arquivo chat.module.css
import style from "./chat.module.css";

// Importação de componentes e hooks necessários
import SendIcon from "@mui/icons-material/Send";
import { Input } from "@mui/material";
import { useEffect, useRef, useState } from "react";

// Definição do componente Chat
const Chat = ({ socket }) => {
  // Refs para elementos do DOM
  const messageRef = useRef(); // Ref para a entrada de mensagem
  const bottomRef = useRef(); // Ref para o elemento inferior para rolagem automática

  // Estado para armazenar as mensagens
  const [messageBox, setMessageBox] = useState([]);

  // Efeito que foca na entrada de mensagem quando o componente monta
  useEffect(() => {
    messageRef.current.focus();

    // Listener para receber mensagens do socket
    socket.on("receive_message", (data) => {
      // Atualiza o estado das mensagens com a nova mensagem recebida
      setMessageBox((current) => [...current, data]);
    });

    // Função de cleanup que remove o listener quando o componente desmonta
    return () => socket.off("receive_message");
  }, [socket]);

  // Efeito para rolar automaticamente para a última mensagem quando há uma nova mensagem
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messageBox]);

  // Função para enviar uma mensagem
  const messageSubmit = () => {
    const message = messageRef.current.value;
    if (!message.trim()) return; // Ignora mensagens em branco

    // Emite a mensagem via socket
    socket.emit("message", message);

    // Limpa a entrada de mensagem e coloca o foco de volta nela
    clearInput();
    messageRef.current.focus();
  };

  // Função para limpar o conteúdo da entrada de mensagem
  const clearInput = () => {
    messageRef.current.value = "";
  };

  // Manipula o evento de pressionar a tecla Enter na entrada de mensagem
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      messageSubmit();
    }
  };

  // Renderização do componente Chat
  return (
    <>
      <div className={style["chat-container"]}>
        <div className={style["chat-body"]}>
          {/* Mapeia e renderiza as mensagens */}
          {messageBox.map((message, index) => (
            <div
              className={`${style["message-container"]} ${
                // Adiciona a classe "message-mine" se a mensagem for do próprio usuário
                message.authorID === socket.id && style["message-mine"]
              }`}
              key={index}
            >
              <div className={style["message-author"]}>
                <strong>{message.author}</strong>
              </div>
              <div className={style["message-text"]}>{message.text}</div>
            </div>
          ))}
          <div ref={bottomRef} /> {/* Elemento para rolagem automática */}
        </div>

        {/* Componentes para a entrada de mensagem e envio */}
        <div className={style["chat-footer"]}>
          <Input
            inputRef={messageRef}
            placeholder="Mensagem"
            fullWidth
            onKeyDown={handleKeyPress}
          />
          <SendIcon
            sx={{ m: 1, cursor: "pointer" }}
            style={{ color: "#129d93" }}
            onClick={() => messageSubmit()}
          />
        </div>
      </div>
    </>
  );
};

export default Chat; // Exporta o componente Chat

