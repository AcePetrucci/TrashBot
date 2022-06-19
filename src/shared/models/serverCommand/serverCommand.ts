import { BaseCommandInteraction, Client, Message } from 'discord.js';
import { SlashCommandBuilder } from "@discordjs/builders";
import { Observable } from 'rxjs';

export interface ISlashCommand {
  data: SlashCommandBuilder;
  trigger: (
    interaction: BaseCommandInteraction,
    client: Client
  ) => Observable<Message<boolean>>;
}

export interface ILegacyCommand {
  data: SlashCommandBuilder;
  trigger: (
    message: Message,
    client: Client
  ) => Observable<Message<boolean>>;
};