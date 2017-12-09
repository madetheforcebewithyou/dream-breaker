import _ from 'lodash';
import trace from 'stack-trace';
import util from 'util';
import moment from 'moment';
import colors from 'colors/safe';

const _metadata = Symbol();
const _config = Symbol();
const _cwd = Symbol();
const _filterLevel = Symbol();

const _fileAndLine = Symbol();
const _timestamp = Symbol();
const _log = Symbol();
const _write = Symbol();
const _formatString = Symbol();
const _colorize = Symbol();
const _transformMetadata = Symbol();
const _getLevelValue = Symbol();
const _ignoreLog = Symbol();

export default class Logger {
  constructor(options = {}) {
    const { config = {}, metadata = {} } = options;

    this[_config] = config;
    this[_metadata] = metadata;
    this[_cwd] = process.cwd();
    this[_filterLevel] = config.filterLevel || 'silly';

    colors.setTheme({
      'type.log': 'blue',
      'type.audit': 'red',
      'level.silly': 'magenta',
      'level.debug': 'blue',
      'level.verbose': 'cyan',
      'level.info': 'green',
      'level.warn': 'yellow',
      'level.error': 'red',
      msg: 'bold',
      metadata: 'gray',
      at: 'underline',
    });
  }

  get [_fileAndLine]() {
    const { stackLevel = 3 } = this[_config];
    let fileName = '';
    let functionName = '';
    let lineNumber = '';

    const t = trace.get();
    if (t[stackLevel]) {
      fileName = t[stackLevel].getFileName().replace(this[_cwd], '');
      functionName = t[stackLevel].getFunctionName();
      lineNumber = t[stackLevel].getLineNumber();
    }

    return `[${functionName}()@${fileName}:${lineNumber}]`;
  }

  get [_timestamp]() {
    return moment().format('YYYY-MM-DD HH:mm:ssZ');
  }

  [_colorize](type, str) {
    return colors[type] ? colors[type](str) : str;
  }

  [_formatString](obj) {
    let result = '';

    const { format = 'console' } = this[_config];
    const { type, level, timestamp, at, msg, metadata } = obj;

    switch (format) {
      case 'json':
        result = util.format('%j\n', { type, level, timestamp, at, msg, ...metadata });
        break;
      case 'console':
      default:
        result =
          `${this[_colorize](`type.${type}`, type)} ` +
          `${this[_colorize]('timestamp', timestamp)} ` +
          `${this[_colorize](`level.${level}`, level)} - ` +
          `${this[_colorize]('at', at)}: ` +
          `${this[_colorize]('msg', msg)} ` +
          `${this[_colorize]('metadata', util.format('%j', metadata))}` +
          '\n';
        break;
    }

    return result;
  }

  [_transformMetadata](metadata) {
    const m = _.isObject(metadata) ? metadata : { metadata };

    return {
      ...this[_metadata],
      ...m,
    };
  }

  [_write](data) {
    process.stdout.write(data);
  }

  [_getLevelValue](level) {
    const levelMapping = {
      silly: 1,
      debug: 2,
      verbose: 3,
      info: 4,
      warn: 5,
      error: 6,
    };

    return levelMapping[level] || Number.MAX_VALUE;
  }

  [_ignoreLog](type, level) {
    if (type !== 'log') {
      return false;
    }

    return this[_getLevelValue](level) < this[_getLevelValue](this[_filterLevel]);
  }

  [_log]({ msg, metadata, level, type }) {
    if (this[_ignoreLog](type, level)) {
      return;
    }

    const at = this[_fileAndLine];
    const timestamp = this[_timestamp];
    const stringToWrite = this[_formatString]({
      metadata: this[_transformMetadata](metadata),
      timestamp,
      msg,
      type,
      level,
      at,
    });

    this[_write](stringToWrite);
  }

  silly(msg, metadata) {
    this[_log]({ msg, metadata, level: 'silly', type: 'log' });
  }

  debug(msg, metadata) {
    this[_log]({ msg, metadata, level: 'debug', type: 'log' });
  }

  verbose(msg, metadata) {
    this[_log]({ msg, metadata, level: 'verbose', type: 'log' });
  }

  info(msg, metadata) {
    this[_log]({ msg, metadata, level: 'info', type: 'log' });
  }

  warn(msg, metadata) {
    this[_log]({ msg, metadata, level: 'warn', type: 'log' });
  }

  error(msg, metadata) {
    this[_log]({ msg, metadata, level: 'error', type: 'log' });
  }

  audit(msg, metadata) {
    this[_log]({ msg, metadata, type: 'audit' });
  }
}
