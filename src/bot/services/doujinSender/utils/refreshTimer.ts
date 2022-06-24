import { INhenServerConfig } from 'shared/models';

/**
 * Doujin Timer
 */

export const doujinTimer = () => {

  const _dayMs = 1000 * 60 * 60 * 24;
  const _lastTimer = 0;
  const _incrementMs = 16000000;
  const generateTimer = () => Math.floor(Math.random() * _dayMs + 1);


  /**
   * Refresh Timer
   */

  const refreshTimer = (
    nhenServerConfig: INhenServerConfig,
    needToIncrement = 0
  ) => {
    const generatedTimer = generateTimer();

    return (generatedTimer + _lastTimer + needToIncrement) > _dayMs
      ? nhenServerConfig.timer.next(generatedTimer)
      : refreshTimer(nhenServerConfig, needToIncrement + _incrementMs);
  }


  /**
   * Return Doujin Timer
   */

  return { generateTimer, refreshTimer };
}