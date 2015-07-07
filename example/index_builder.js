var lunr = require('./../elasticlunr.js'),
    fs = require('fs')

var idx = lunr(function () {
  this.setRef('id')

  this.addField('title', { boost: 10 })
  this.addField('tags', { boost: 100 })
  this.addField('body')
})

fs.readFile('./example/example_data.json', function (err, data) {
  if (err) throw err

  var raw = JSON.parse(data)

  var questions = raw.questions.map(function (q) {
    return {
      id: q.question_id,
      title: q.title,
      body: q.body,
      tags: q.tags.join(' ')
    }
  })

  questions.forEach(function (question) {
    idx.addDoc(question)
  })

  fs.writeFile('./example/example_index.json', JSON.stringify(idx), function (err) {
    if (err) throw err
    console.log('done')
  })
})
