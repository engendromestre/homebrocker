FROM node:20-slim

# Nesta imagem há um usuário node por padrão,
# sendo ele um usuário que não tem todas as permissões por motivo de segurança
# diretório app onde vai ficar o projeto dentro do container
WORKDIR /home/node/app

# Muda o usuário padrão para o usuário node
# pois vem como root
USER node

# não quero rodar nada a princípio no projeto
# quero que o container fique de pé para que possa ser desenvolvido nele
# tail - comando linux que lê arquivos
# -f - ler indefinidamente o dispositivo nulo do linux
# Ou seja, o container vai ficar rodando até ser interrompido 
CMD [ "tail", "-f", "/dev/null" ]