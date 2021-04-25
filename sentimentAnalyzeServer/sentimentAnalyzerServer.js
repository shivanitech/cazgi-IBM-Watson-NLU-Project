const express = require('express');
const dotenv = require('dotenv');
const app = new express();
dotenv.config();

function getNLUInstance() {
  let api_key = process.env.API_KEY;
  let api_url = process.env.API_URL;
  
  const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
  const { IamAuthenticator } = require('ibm-watson/auth');
  
  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
      apikey: api_key,
    }),
    serviceUrl: api_url,
  });
  return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

function textEmotion(textToAnalyze,res) {
    let naturalLanguageUnderstanding = getNLUInstance();

    const analyzeParams = {
  'text': textToAnalyze,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
  },
};
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            a=analysisResults.result.keywords[0];
            //a=Object.keys(analysisResults.result.keywords);
            console.log(a.emotion);
            res.send(analysisResults.result.keywords[0].emotion);
        }).catch(err => {
          res.send(err.toString());
        });
}

function urlEmotion(urlToAnalyze,res) {
    let naturalLanguageUnderstanding = getNLUInstance();

    const analyzeParams = {
  'url': urlToAnalyze,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
  },
};
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            res.send(analysisResults.result.keywords[0].emotion);
        }).catch(err => {
          res.send(err.toString());
        });
}

function textSentiment(textToAnalyze,res) {
    let naturalLanguageUnderstanding = getNLUInstance();

    const analyzeParams = {
  'text': textToAnalyze,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
  },
};
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
             res.send(analysisResults.result.keywords[0].sentiment.label);
        }).catch(err => {
          res.send(err.toString());
        });
}

function urlSentiment(urlToAnalyze,res) {
    let naturalLanguageUnderstanding = getNLUInstance();

    const analyzeParams = {
  'url': urlToAnalyze,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
  },
};
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
             res.send(analysisResults.result.keywords[0].sentiment.label);
        }).catch(err => {
          res.send(err.toString());
        });
}



app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
 let urlToAnalyze = req.query.url;
    urlEmotion(urlToAnalyze,res);
});

app.get("/url/sentiment", (req,res) => {
    let urlToAnalyze = req.query.url;
    urlSentiment(urlToAnalyze,res);
});

app.get("/text/emotion", (req,res) => {
    let textToAnalyze = req.query.text;
    textEmotion(textToAnalyze,res);
    console.log(res);
  //  return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
       let textToAnalyze = req.query.text;
    textSentiment(textToAnalyze,res);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

