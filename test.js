var fs = require('fs'),
    spawn = require('child_process').spawn,
    mkdirp = require('mkdirp').sync,
    browserify = require('browserify'),
    watchify = require('watchify');

var bundle1 = browserify('./test1.js', watchify.args)

var bundle2 = browserify('./test2.js', watchify.args)
  .external(bundle1)

mkdirp('./out')

watchify(bundle1).on('update', function() {
  bundle1.bundle().pipe(fs.createWriteStream('out/test1.js'))
})

watchify(bundle2).on('update', function() {
  bundle2.bundle().pipe(fs.createWriteStream('out/test2.js'))
})

bundle1.emit('update')
bundle2.emit('update')

bundle2.once('log', function() {
  spawn('touch', ['test2.js'])
  bundle2.once('log', function() {
    setTimeout(function() {
      process.exit(0)
    }, 1000)
  })
})
