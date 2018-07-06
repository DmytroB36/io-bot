import {Component} from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

@Component({

  selector: 'app-bot',
  templateUrl: './bot.html'

})

export class Bot {

  public question: string;
  public answer: string;
  public STORAGE_KEY: string = 'bot.answers';

  public loader: object;

  public answersStorage: object;

  constructor(public storage: Storage, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

    this.loadAnswersFromStorage();

    this.storage = storage;
    this.alertCtrl = alertCtrl;

    this.loader = this.loadingCtrl.create({
      content: "I think...",
      duration: Bot.getRandomInt(250, 2000)
    });

  }

  public static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  addAnswerPossible(answerVariant) {
    if (!this.answersStorage.hasOwnProperty(this.question) || typeof this.answersStorage[this.question] !== 'object') {
      this.answersStorage[this.question] = [];
    }

    this.answersStorage[this.question].push(answerVariant);
    this.saveAnswersToStorage();
  }

  getAnswerPossible() {
    if (!this.answersStorage.hasOwnProperty(this.question)) {
      return;
    }
    if (typeof this.answersStorage[this.question] == 'string') {
      return this.answersStorage[this.question];
    }

    let keys = Object.keys(this.answersStorage[this.question]);

    let index = Bot.getRandomInt(0, keys.length);

    let answerIndex = keys[index];

    return this.answersStorage[this.question][answerIndex];
  }

  saveAnswersToStorage() {
    this.storage.set(this.STORAGE_KEY, this.answersStorage);
  }

  loadAnswersFromStorage() {
    this.answersStorage = this.storage.get(this.STORAGE_KEY);
  }

  showTeachPrompt() {
    const prompt = this.alertCtrl.create({
      message: 'how to answer a question: "' + this.question + '"?',
      inputs: [
        {
          name: 'Possible answer',
          placeholder: 'Possible answer'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {

          }
        },
        {
          text: 'Save',
          handler: data => {
            this.addAnswerPossible(data['Possible answer']);
          }
        },
        {
          text: 'Save & another',
          handler: data => {
            this.addAnswerPossible(data['Possible answer']);
            return false;
          }
        }
      ]
    });
    prompt.present();
  };

  takeQuestion () {

    if (this.question.slice(-1) == '?') {

      if (this.answersStorage.hasOwnProperty(this.question)) {
        this.answer = this.getAnswerPossible();
      } else {
        this.showTeachPrompt();
      }

    } else {
      this.answer = "";
    }

  };

}
