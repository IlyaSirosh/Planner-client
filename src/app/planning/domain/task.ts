let i = 0;
export class Task {
  public id: number;
  constructor(public title: string, public begin: Date, public end: Date, public notes: string) {
    this.id = i++;
  }

  static TASKS: Task[] = [
    new Task('Title 1',
      new Date(2019, 1, 25, 6, 15),
      new Date(2019, 1, 25, 8, 45), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, cupiditate dignissimos dolore doloremque error '),
    new Task('Title 2',
      new Date(2019, 1, 25, 11, 0),
      new Date(2019, 1, 25, 13, 30), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, cupiditate dignissimos dolore doloremque error '),
    new Task('Title 3',
      new Date(2019, 1, 25, 13, 30),
      new Date(2019, 1, 25, 14, 0), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, cupiditate dignissimos dolore doloremque error '),
    new Task('Title 4',
      new Date(2019, 1, 25, 15, 15),
      new Date(2019, 1, 25, 15, 55), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, cupiditate dignissimos dolore doloremque error '),
    new Task('Title 5',
      new Date(2019, 1, 25, 16, 0),
      new Date(2019, 1, 25, 18, 15), 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, cupiditate dignissimos dolore doloremque error '),
    new Task('Title 6',
      new Date(2019, 1, 25, 18, 20),
      null, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, cupiditate dignissimos dolore doloremque error '),
    new Task('Title 7',
      new Date(2019, 1, 25, 19, 0),
      new Date(2019, 1, 25, 20, 15), null),
    new Task('Title 8',
      new Date(2019, 1, 25, 20, 15),
      null, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis, cupiditate dignissimos dolore doloremque error ')
  ];

}



