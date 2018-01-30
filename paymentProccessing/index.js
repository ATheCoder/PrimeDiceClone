const BlockIo = require('block_io');
const version  = 2;
const block_io = new BlockIo('6450-1056-e535-db82', '76527652arash', version);
block_io.get_balance(function (err, result) {
    console.log(result.data);
});