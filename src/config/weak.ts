// Слабые устройства: data-weak на <html> до первой отрисовки. Когда атрибут стоит, стекло
// (backdrop-filter) на таблетках шапки и на нижнем меню выключается и заменяется плотным фоном:
// блюр пересчитывается на каждом кадре прокрутки и дорог на слабых Android. iPhone и мощные
// устройства остаются со стеклом.
// Встраивается в скрипт в начале <body>, как TEXT_SIZE_SCRIPT и SCROLL_SCRIPT.

export const WEAK_SCRIPT = `try{var n=navigator,c=n.connection;var w=!!(c&&c.saveData)||(n.deviceMemory||8)<=2||(n.hardwareConcurrency||8)<=2;if(w)document.documentElement.setAttribute("data-weak","")}catch(e){}`;
