http://www.androidhive.info/2011/08/how-to-switch-between-activities-in-android/
https://github.com/IjzerenHein/famous-flex
https://github.com/Famous/famous/blob/develop/src/views/Lightbox.js

PapersSystem API

	getPaper <=> getIntent();
		get current page


Paper API



THINKING ABOUT CODE STYLE

PapersSystem.createPaper('ChatsPaper', ChatsPaper);


var i = new PapersSystem.Intent({
	_id: 'abc'
}, PapersSystem.class.ChatsPaper);

i.start(); // save paper, paper hien tai an (co the xoa khong render), paper tiep theo show

i.finish(); // an paper hien tai (xoa), paper truoc thi hien len



Paper : {
	

}


