import { createWriteStream } from 'fs';

import {
  IEmbed,
  MessageInteraction,
  IListType
} from "shared/models";


/**
 * Convert To List
 */

export const convertToList = async (listData: IEmbed[]) => {
  const formattedList = listData.map(itemData => {
    const listEntry = itemData.text
      .concat(` - ${itemData.author}`)
      .concat(` - ${itemData.date.toLocaleDateString()}`)
      .concat('\n\n');

    return listEntry;
  })

  return formattedList;
}


/**
 * Generate List
 */

export const generateList = (
  formattedList: string[],
  type: IListType,
  interaction: MessageInteraction
) => {
  const serverOwner = interaction.guild;
  const filePath = `${type.toLowerCase()}/${serverOwner.id}.quotes.txt`;
  const serverPath = process.env.DEV
    ? 'http://localhost:4444/'
    : 'https://trashbotjs.herokuapp.com/';

  const listFile = createWriteStream(`public/${filePath}`, {flags: 'w', encoding: 'utf8'});
  listFile.write(`${serverOwner.name.toUpperCase()} ${type.toUpperCase()} LIST \n\n`, 'utf8');

  formattedList.forEach(listEntry => listFile.write(listEntry));

  listFile.end();

  return serverPath.concat(filePath);
}