const { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionFlagsBits, ApplicationCommandType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration
    ]
});

// Collections para comandos
client.commands = new Collection();
client.slashCommands = new Collection();

// Configurações do bot
const config = {
    prefix: process.env.PREFIX || '.',
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    tenorApiKey: process.env.TENOR_API_KEY,
    discloudApiKey: process.env.DISCLOUD_API_KEY,
    botName: process.env.BOT_NAME || 'Yakuza',
    ownerId: process.env.BOT_OWNER_ID
};

// Cores do tema Yakuza (preto e vermelho neon)
const colors = {
    primary: 0x000000,  // Preto
    accent: 0xFF0033,   // Vermelho neon
    success: 0x00FF00,  // Verde para sucesso
    error: 0xFF0000     // Vermelho para erro
};

// Função para criar embed padrão do Yakuza
function createYakuzaEmbed(title, description, color = colors.primary) {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter({ text: 'Yakuza — by liro' })
        .setTimestamp();
}

// Carregamento de comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    // Comandos com prefixo
    if (command.name) {
        client.commands.set(command.name, command);
        if (command.aliases) {
            command.aliases.forEach(alias => {
                client.commands.set(alias, command);
            });
        }
    }
    
    // Comandos slash
    if (command.slashData) {
        client.slashCommands.set(command.slashData.name, command);
    }
}

// Event: Bot pronto
client.once('ready', async () => {
    console.log(`${config.botName} está online!`);
    console.log(`Logado como: ${client.user.tag}`);
    console.log(`Servidores: ${client.guilds.cache.size}`);
    
    // Definir status
    client.user.setPresence({
        activities: [{
            name: `${config.prefix}help | Yakuza Bot`,
            type: 0
        }],
        status: 'online'
    });
    
    // Registrar comandos slash
    await registerSlashCommands();
});

// Registrar comandos slash
async function registerSlashCommands() {
    try {
        const commands = [];
        
        client.slashCommands.forEach(command => {
            commands.push(command.slashData.toJSON());
        });
        
        const rest = new REST({ version: '9' }).setToken(config.token);
        
        console.log('Registrando comandos slash...');
        
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands }
        );
        
        console.log('Comandos slash registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos slash:', error);
    }
}

// Event: Mensagem (comandos com prefixo)
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName);
    if (!command) return;
    
    try {
        await command.execute(message, args, client, config, colors, createYakuzaEmbed);
    } catch (error) {
        console.error(`Erro no comando ${commandName}:`, error);
        
        const errorEmbed = createYakuzaEmbed(
            'Erro',
            'Ocorreu um erro ao executar este comando.',
            colors.error
        );
        
        await message.reply({ embeds: [errorEmbed] });
    }
});

// Event: Interação (comandos slash e botões)
client.on('interactionCreate', async (interaction) => {
    // Comandos slash
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;
        
        try {
            await command.executeSlash(interaction, client, config, colors, createYakuzaEmbed);
        } catch (error) {
            console.error(`Erro no comando slash ${interaction.commandName}:`, error);
            
            const errorEmbed = createYakuzaEmbed(
                'Erro',
                'Ocorreu um erro ao executar este comando.',
                colors.error
            );
            
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
    
    // Interações de botões
    if (interaction.isButton()) {
        try {
            const [action, userId] = interaction.customId.split('_');
            const user = await client.users.fetch(userId);
            const member = interaction.guild.members.cache.get(userId);
            
            switch (action) {
                case 'avatar':
                    const avatarEmbed = createYakuzaEmbed(
                        `Avatar de ${user.username}`,
                        `[Clique aqui para baixar](${user.displayAvatarURL({ dynamic: true, size: 1024 })})`,
                        colors.accent
                    );
                    avatarEmbed.setImage(user.displayAvatarURL({ dynamic: true, size: 512 }));
                    await interaction.reply({ embeds: [avatarEmbed], ephemeral: true });
                    break;
                    
                case 'banner':
                    const fetchedUser = await client.users.fetch(userId, { force: true });
                    if (fetchedUser.banner) {
                        const bannerEmbed = createYakuzaEmbed(
                            `Banner de ${user.username}`,
                            `[Clique aqui para baixar](${fetchedUser.bannerURL({ dynamic: true, size: 1024 })})`,
                            colors.accent
                        );
                        bannerEmbed.setImage(fetchedUser.bannerURL({ dynamic: true, size: 512 }));
                        await interaction.reply({ embeds: [bannerEmbed], ephemeral: true });
                    } else {
                        const noBannerEmbed = createYakuzaEmbed(
                            'Banner Não Encontrado',
                            `${user.username} não possui um banner personalizado.`,
                            colors.error
                        );
                        await interaction.reply({ embeds: [noBannerEmbed], ephemeral: true });
                    }
                    break;
                    
                case 'permissions':
                    if (member) {
                        const permissions = member.permissions.toArray();
                        const importantPerms = permissions.filter(perm => 
                            ['Administrator', 'ManageMessages', 'ManageRoles', 'ManageGuild', 'BanMembers', 'KickMembers', 'ManageChannels'].includes(perm)
                        );
                        
                        const permissionsEmbed = createYakuzaEmbed(
                            `Permissões de ${user.username}`,
                            null,
                            colors.accent
                        );
                        
                        if (importantPerms.length > 0) {
                            permissionsEmbed.addFields({
                                name: '**Permissões Importantes**',
                                value: importantPerms.map(perm => `${perm}`).join('\n'),
                                inline: false
                            });
                        } else {
                            permissionsEmbed.setDescription('Este usuário não possui permissões administrativas especiais.');
                        }
                        
                        await interaction.reply({ embeds: [permissionsEmbed], ephemeral: true });
                    } else {
                        const noMemberEmbed = createYakuzaEmbed(
                            'Usuário Não Encontrado',
                            'Este usuário não está no servidor.',
                            colors.error
                        );
                        await interaction.reply({ embeds: [noMemberEmbed], ephemeral: true });
                    }
                    break;
                    
                default:
                    const unknownEmbed = createYakuzaEmbed(
                        'Ação Desconhecida',
                        'Esta ação não foi reconhecida.',
                        colors.error
                    );
                    await interaction.reply({ embeds: [unknownEmbed], ephemeral: true });
            }
        } catch (error) {
            console.error('Erro ao processar interação de botão:', error);
            
            const errorEmbed = createYakuzaEmbed(
                'Erro',
                'Ocorreu um erro ao processar esta ação.',
                colors.error
            );
            
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
});

// Event: Erro
client.on('error', (error) => {
    console.error('Erro do Discord.js:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Erro não tratado:', error);
});

// Login do bot
client.login(config.token);