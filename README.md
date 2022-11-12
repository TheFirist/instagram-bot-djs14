# 📸 Bot com sistema de Instagram feito em Discord.js (v14).
## 🤓 Sabe aqueles sistemas de Instagram que tem naqueles servidores 'web-hypados' com botões pra dar like, comentar etc? Então, é esse bot ai.
```
💻 Envia a imagem por webhook com o nome e avatar do usuário. 
🎾 O bot possui 4 botões: 'Like', 'Comentar', 'Ver Comentários' e 'Deletar Foto'.
```

# 🏡 Como faço pra usar?
```
・Crie uma pasta e baixe os arquivos do projeto. | Primeiro passo.
・Renomeie o arquivo .exemplo .env para .env e altere todas informações que estão lá. | Segundo passo.
・Utilize npm i no terminal para instalar todas libs utilizadas no bot. | Terceiro passo.
・Rode o bot utilizando 'node botStart.js'. | Último passo.
```

## 🚨 No arquivo .env, preencha as informações da seguinte forma:
```
botToken: Token do bot que você criou no Portal de Desenvolvedores do Discord.
mongoUrl: Seu link para se conectar com a MongoDB.
botPrefix: Prefixo que o bot usará para responder os comandos.
canalId: ID do canal do Discord que será usado como canal de 'Instagram'.
```

### OBS: os códigos desse sistema em si encontram-se nos eventos messageCreate e interactionCreate, o resto do bot é somente minha base em DJS14.

# 🏆 Créditos:

**[Linn#0002](https://discord.gg/nayeon)** (Criador do código)
