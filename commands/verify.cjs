const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const configStore = {}; // Simulação de armazenamento de configuração


module.exports = {
    name: 'verify',
    aliases: ['verificar'],
    description: 'Configurar sistema de verificação do servidor',
    
     slashData: new SlashCommandBuilder() // Definição do comando slash
        .setName('verify')
        .setDescription('Configurar sistema de verificação do servidor')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub => 
            sub.setName('config')
                .setDescription('Configurar cargos e canal de notificações')
                .addRoleOption(opt => opt.setName('random').setDescription('Cargo random').setRequired(true))
                .addRoleOption(opt => opt.setName('verificado').setDescription('Cargo verificado').setRequired(true))
                .addChannelOption(opt => opt.setName('notificacoes').setDescription('Canal de notificações').setRequired(true))
        ), // Subcomando para configuração

    async execute(message, args, client, config, colors, createYakuzaEmbed) {
        // Verifica se o usuário é admin
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const noPermEmbed = createYakuzaEmbed(
                'Sem Permissão',
                'Apenas administradores podem usar este comando.',
                colors.error
            );
            return message.reply({ embeds: [noPermEmbed] });
        }

        await this.createVerificationEmbed(message.channel, colors, createYakuzaEmbed);
        
        const successEmbed = createYakuzaEmbed(
            'Sistema de Verificação',
            'Sistema de verificação configurado com sucesso!',
            colors.success
        );
        await message.reply({ embeds: [successEmbed] });
    },
    
    async executeSlash(interaction, client, config, colors, createYakuzaEmbed) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const noPermEmbed = createYakuzaEmbed(
                'Sem Permissão',
                'Apenas administradores podem usar este comando.',
                colors.error
            );
            return interaction.reply({ embeds: [noPermEmbed], ephemeral: true });
        }

        if (interaction.options.getSubcommand() === 'config') {
            const randomRole = interaction.options.getRole('random');
            const verifiedRole = interaction.options.getRole('verificado');
            const notifyChannel = interaction.options.getChannel('notificacoes');

            configStore[interaction.guild.id] = {
                randomRole: randomRole.id,
                verifiedRole: verifiedRole.id,
                notifyChannel: notifyChannel.id
            };

            const configEmbed = createYakuzaEmbed(
                'Configuração Salva',
                `Cargo random: <@&${randomRole.id}>\nCargo verificado: <@&${verifiedRole.id}>\nCanal de notificações: <#${notifyChannel.id}>`,
                colors.success
            );
            return interaction.reply({ embeds: [configEmbed], ephemeral: true });
        }

        await this.createVerificationEmbed(interaction.channel, colors, createYakuzaEmbed);
        const successEmbed = createYakuzaEmbed(
            'Sistema de Verificação',
            'Sistema de verificação configurado com sucesso!',
            colors.success
        );
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },

    async createVerificationEmbed(channel, colors, createYakuzaEmbed) {
        const verifyEmbed = createYakuzaEmbed(
            'Verificação do Servidor Yakuza',
            '**Bem-vindo(a) ao nosso servidor!**\n\n' +
            '**Para ter acesso completo ao servidor, você precisa se verificar.**\n\n' +
            'Clique no botão **"Iniciar Verificação"** abaixo\n' +
            'O bot irá te chamar no privado para uma conversa rápida\n' +
            'Após a aprovação da staff, você terá acesso total\n\n' +
            '**Importante:**\n' +
            '• Seja respeitoso com todos os membros\n' +
            '• Não faça spam ou flood\n' +
            '• Siga as regras do servidor e do Discord\n\n' +
            '**Clique no botão para começar sua verificação!**',
            colors.primary
        );

        const verifyButton = new ButtonBuilder()
            .setCustomId('start_verification')
            .setLabel('Iniciar Verificação')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(verifyButton);

        await channel.send({ 
            embeds: [verifyEmbed], 
            components: [row] 
        });
    }
};