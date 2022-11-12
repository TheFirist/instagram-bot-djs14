const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, WebhookClient, ButtonStyle, TextInputBuilder, ModalBuilder, getTextInputValue, TextInputStyle, ActionRow } = require('discord.js');

module.exports = async (client, interaction) => {

   const dbGuild = await client.db.guilds.findOne({_id: interaction.guild.id,});
   const dbUser = await client.db.users.findOne({_id: interaction.user.id,});
  
   if (!dbGuild) await client.db.guilds.create({ _id: interaction.guild.id });
   if (!dbUser) await client.db.users.create({ _id: interaction.user.id });
    
   if (interaction.isCommand()) {
    const slashCmd = client.slash.get(interaction.commandName);
    if (!slashCmd) return interaction.reply({ content: 'Ocorreu um erro.'});
    
    const argsCmd = [];
    
    for (let optionCmd of interaction.options.data) {
        if (optionCmd.type === 'SUB_COMMAND') {
            if (optionCmd.name) argsCmd.push(optionCmd.name);
            optionCmd.options?.forEach(x => {
                if (x.value) argsCmd.push(x.value);
            });
        } else if (optionCmd.value) argsCmd.push(optionCmd.value);
    }
    
    try {
        slashCmd.run(client, interaction, argsCmd);
    } catch (err) {
        console.error("🚨 | [Erro] " + err);
    }
  }

  if(interaction.isButton()) {

    if(interaction.customId === 'verComents') { // Botão para ver os comentários da foto.
        const fotoDb = await client.db.insta.findOne({_id: interaction.message.id});
        if(!fotoDb) return;

        const embedComent = new EmbedBuilder()
        .setDescription(fotoDb.comentariosFoto.join('\n') || `Sem comentários.`)
        .setAuthor({ name: `Comentários da postagem [${fotoDb.comentariosFoto.length}]`})
  
        interaction.reply({ embeds: [embedComent], ephemeral: true})
    }

    if(interaction.customId === 'comentInsta') { // Botão para comentar em uma foto.
        const modalComent = new ModalBuilder()
        .setCustomId('modalComent')
        .setTitle(`Comentando na Foto`)
        const modalPergunta = new TextInputBuilder()
        .setCustomId('comentInsta')
        .setLabel('Coloque abaixo seu comentário para a foto.')
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(80)

        const rowComent = new ActionRowBuilder().addComponents(modalPergunta)
        modalComent.addComponents(rowComent)
        interaction.showModal(modalComent);
    }
        
    if(interaction.customId === 'deletarFoto') { // Botão para apagar uma foto.
        let fotoDb = await client.db.insta.findOne({_id: interaction.message.id });
        if(!fotoDb) return;

        if(interaction.user.id !== fotoDb.autorFoto) {
            interaction.reply({ content: `Você não é o autor dessa foto para remover ela.`, ephemeral: true})
        } else {
            await interaction.message.delete()
        }
    };

    if(interaction.customId === 'likeInsta') { // Botão para dar like nas fotos.
        let fotoDb = await client.db.insta.findOne({_id: interaction.message.id });
        if(!fotoDb) return;

        const guildDb = await client.db.guilds.findOne({_id: interaction.guild.id });
        const whInsta = new WebhookClient({ url: guildDb.whInsta });

        if(fotoDb.curtidoresFoto.includes(interaction.user.id)) {

            const rowLikeR = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('likeInsta')
                .setEmoji('👍')
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`${fotoDb.likesFoto - 1}`),
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

            await whInsta.editMessage(interaction.message.id, { components: [rowLikeR]})

            await client.db.insta.findOneAndUpdate(
                { _id: interaction.message.id },
                { $set: {"likesFoto": fotoDb.likesFoto - 1}});

            await client.db.insta.findOneAndUpdate(
                { _id: interaction.message.id },
                { $pull: {"curtidoresFoto": interaction.user.id}})

            interaction.reply({ content: `Você removeu a curtida da foto com sucesso.`, ephemeral: true})
        } else {
            let likesFoto = fotoDb.likesFoto;
            likesFoto += 1;

            const rowLikeA = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId('likeInsta')
                .setEmoji('👍')
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`${likesFoto}`),
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

            await whInsta.editMessage(interaction.message.id, { components: [rowLikeA]})

            await client.db.insta.findOneAndUpdate(
                { _id: interaction.message.id },
                { $set: {"likesFoto": fotoDb.likesFoto + 1}})

            await client.db.insta.findOneAndUpdate(
                { _id: interaction.message.id },
                { $push: {"curtidoresFoto": interaction.user.id}})

            interaction.reply({ content: `Você deu uma curtida nessa foto com sucesso.`, ephemeral: true})
        }
    }
  }

  if (interaction.isModalSubmit()) { // Pegar conteúdo do Modal de comentar numa foto.
    if (interaction.customId === 'modalComent') {
        const comentFoto = interaction.fields.getTextInputValue('comentInsta')

        await client.db.insta.findOneAndUpdate(
          { _id: interaction.message.id },
          { $push: {"comentariosFoto": `**${interaction.user.tag}**: ${comentFoto}`}});
    
          interaction.reply({ content: `Você enviou seu comentário com sucesso.`, ephemeral: true})
    }
  }
}
