import { createWriteStream } from 'fs';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  IClient,
  MessageInteraction,
  InteractionDeferred,
  IListType,
  IEmbed,
  IListSetter
} from "shared/models";

import { setEmbedData, formatEmbed } from 'shared/utils';

import {
  interactionHandler
} from '../interaction';


/**
 * List Handler
 */

export const listHandler = (
  interaction: MessageInteraction,
  client: IClient,
  type: IListType,
  interactionInstance?: InteractionDeferred,
) => {

  const {
    editReplyEmbed
  } = interactionHandler(interaction, client, interactionInstance);


  /**
   * 
   */

  const prepareList = (
    listItems: any[],
    setListItemData: IListSetter
  ) => {
    return _setListData(listItems, setListItemData).pipe(
      map(listData => _formatList(listData)),
      map(formattedList => _createList(formattedList, type))
    );
  }
  

  /**
   * Edit List Message
   */

  
  const listEditReply = (content: string) => {
    const embedData: IEmbed = {
      ...setEmbedData(`${type} List: ${content}`, client),
      ...{
        author: interaction.guild.name,
        authorAvatar: interaction.guild.iconURL(),
      }
    };
    const embedMsg = formatEmbed(embedData, client);
    
    return editReplyEmbed(embedMsg);
  }


  /**
   * Set List Data
   */

  const _setListData = (
    listItems: any[],
    setListItemData: IListSetter
  ) => {
    return zip(
      listItems.map(listItem => setListItemData(listItem))
    );
  }


  /**
   * Set List Data
   */

   const _formatList = (listData: IEmbed[]) => {
    const formattedList = listData.map(itemData => {
      return itemData.text
        .concat(` - ${itemData.author}`)
        .concat(` - ${itemData.date.toLocaleDateString()}`)
        .concat('\n\n');
    })
  
    return formattedList;
  }


  /**
   * Create List
   */

  const _createList = (
    formattedList: string[],
    type: IListType,
  ) => {
    const serverOwner = interaction.guild;
    const filePath = `${type.toLowerCase()}/${serverOwner.id}.${type.toLowerCase()}.txt`;
    const serverPath = JSON.parse(process.env.DEV)
      ? 'http://localhost:4444/'
      : 'https://trashbotjs.herokuapp.com/';
  
    const listFile = createWriteStream(`public/${filePath}`, {flags: 'w', encoding: 'utf8'});
    listFile.write(`${serverOwner.name.toUpperCase()} ${type.toUpperCase()} LIST \n\n`, 'utf8');
  
    formattedList.forEach(listEntry => listFile.write(listEntry));
  
    listFile.end();
  
    return serverPath.concat(filePath);
  }


  /**
   * Return List Handler
   */

  return {
    listEditReply,
    prepareList
  };
}