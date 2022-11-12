const { ChannelType, ActionRowBuilder, ButtonBuilder, EmbedBuilder, WebhookClient, ButtonStyle } = require('discord.js');
const { get } = require('axios');

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type == ChannelType.DM) return;

  if(message.channel.id === process.env.canalId) {
    if(message.attachments.size == 0) await message.delete()

    const guildDb = await client.db.guilds.findOne({_id: message.guild.id });
    const whInsta = new WebhookClient({ url: guildDb.whInsta })

    const rowInsta = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId('likeInsta')
      .setLabel('0')
      .setEmoji('👍'),
      new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId('comentInsta')
      .setEmoji('📨'),
      new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId('verComents')
      .setEmoji('👁‍🗨'),
      new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId('deletarFoto')
      .setEmoji('❌')
    )

    await message.delete()

    await get(guildDb.whInsta, { headers: { Authorization: 'Bot' + process.env.botToken }}).then(async (w) => {
      await whInsta.send({ username: message.author.username, avatarURL: message.author.displayAvatarURL({ dynamyc: true}),
      content: `Foto enviada por **${message.author.tag}** \`[${message.author.id}]\`.`,
      components: [rowInsta],
      files: [{attachment: message.attachments.first().url}]}).then(async (x) => { await client.db.insta.create({ _id: x.id, autorFoto: message.author.id })})
      
    }).catch(async (e) => {
      if(e.code === 'ERR_BAD_REQUEST') {
        const whCreate = await message.channel.createWebhook({ name: client.user.username, avatar: client.user.avatarURL()})
        await client.db.guilds.findOneAndUpdate(
          { _id: message.guild.id },
          { $set: { "whInsta": whCreate.url }});

        const whInsta = new WebhookClient({ url: whCreate.url })

        await whInsta.send({ username: message.author.username, avatarURL: message.author.displayAvatarURL({ dynamyc: true}),
        content: `Foto enviada por **${message.author.tag}** \`[${message.author.id}]\`.`,
        components: [rowInsta],
        files: [{attachment: message.attachments.first().url}]}).then(async (x) => { await client.db.insta.create({ _id: x.id, autorFoto: message.author.id })})
      }
    })
  }
  
  const dbGuild = await client.db.guilds.findOne({_id: message.guild.id,});
  const dbUser = await client.db.users.findOne({_id: message.author.id,});

  if (!dbGuild) await client.db.guilds.create({ _id: message.guild.id });
  if (!dbUser) await client.db.users.create({ _id: message.author.id });

  const botPrefixo = !dbGuild?.prefix ? process.env.botPrefix : dbGuild?.prefix;

  if (!message.content.toLowerCase().startsWith(botPrefixo.toLowerCase())) return;
  if (!message.content.startsWith(botPrefixo)) return;

  const argsBot = message.content.slice(botPrefixo.length).trim().split(/ +/g);

  let cmdFind = argsBot.shift().toLowerCase();
  if (cmdFind.length === 0) return;
  let botCommand = client.commands.get(cmdFind);
  if (!botCommand) botCommand = client.commands.get(client.aliases.get(cmdFind));
  
  try {
    botCommand.run(client, message, argsBot);
  } catch (err) {
    console.error("🚨 | [Erro] " + err);
  }
}
