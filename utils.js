module.exports = {
  req: req,
  log: log,
  fatal: fatal
};

function req(str){
  if ('.' == str.charAt(0)) str = resolve(str); // local paths
  try {
    return require(str);
  } catch (e) {
    fatal(e);
  }
};

function log(msg){
  msg = format.apply(null, arguments);
  console.log(chalk.italic.white('   Hermes'), chalk.gray('·'), msg);
}

function fatal(msg){
  if (msg instanceof Error) msg = msg.message + '\n\n' + indent(msg.stack, 12);
  msg = format.apply(null, arguments);
  console.error(chalk.italic.red('   Hermes'), chalk.gray('·'), msg);
  process.exit(1);
}
