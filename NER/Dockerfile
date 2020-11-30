FROM openjdk:7

WORKDIR /app/NER/

COPY . .

EXPOSE 9191

CMD ["java -Djava.ext.dirs=./lib -cp stanford-ner.jar edu.stanford.nlp.ie.NERServer -port 9191 -loadClassifier ./classifiers/english.muc.7class.distsim.crf.ser.gz  -tokenizerFactory edu.stanford.nlp.process.WhitespaceTokenizer -tokenizerOptions tokenizeNLs=false -outputFormat inlineXML Loading classifier from ./classifiers/english.muc.7class.distsim.crf.ser.gz"]