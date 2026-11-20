# app_comunica

Aplicativo web, responsivo, usando html, css num arquivo e javascript no arquivo app.js. 
1 - Inclui um container na parte superior de toda a tela, para apresentar  arquivos de imagens jpg como miniaturas com 100x100 pixel e uma barra de rolagem na parte inferior desta região para apresentar mais imagens .  Os arquivos estão na pasta "imagens" na raiz do projeto e dentro da pasta “ação” tem os arquivos {} que devem ser apresentados no primeiro container quando a aplicação iniciar.  

2 - Inclui um container na parte inferior de toda a tela, para apresentar  arquivos de imagens jpg como miniaturas com 100x100 pixel e uma barra de rolagem na parte inferior desta região para apresentar mais imagens .  Os arquivos estão na pasta " imagens" na raiz do projeto e dentro da  pasta “objetos” tem  os arquivos { frutas.jpg, legumes.jpg, comidas.jpg} que devem ser apresentados no segundo container quando a aplicação iniciar. 

3 - Na parte central da tela, <div class="area-central">, deve ser dividida em 5 cards com molduras para receber e apresentar imagens jpg com 150x150 pixel. Abaixo de cada card deve ser apresentado o nome do arquivo sem o JPG . O primeiro card tem moldura branca e apresenta de forma fixa e constante o arquivo {gabriel.jpg} que está na pasta imagens. O segundo card tem moldura vermelha e só pode apresentar as imagens da pasta “ação”. O usuário deve clicar e arrastar uma imagem do container “ação” para este card,como resposta, a mesma imagem deve ser copiada para esse card.
O terceiro, quarto e quinto cards tem moldura azul, amarelo e verde respectivamente e só podem apresentar as imagens do container inferior e consequentemente da pasta “objetos”. Inicialmente o usuário pode clicar e arrastar uma imagem do container “objetos” para o terceiro card, a mesma imagem deve ser copiada para esse card. É permitido arrastar uma nova  imagem ( diferente da anterior ) para o quarto card e também posteriormente uma nova imagem diferente das anteriores para o quinto card.   

4 - Na parte inferior da área central deve ter uma caixa de texto com fonte grande para receber os nomes dos arquivos sem jpg formando uma frase ( concatenando os nomes de arquivos).  A ordem dos nomes deve ser a mesma dos cards. O texto deve ser apresentado somente quando pelo menos os três primeiros cards possuírem imagens.  

5 - Incluir um botão abaixo da caixa de texto do item 4 para converter para áudio as palavras da caixa de textos do item 4.  Inicialmente o botão é desabilitado até que o texto do item 4 esteja disponível.
 
6 - incluir na <div class="area-central"> duas caixas de seleção sendo:  
Caixa (a) : 
estado:    desativada
Texto: 		 "Permitir digitar texto" 
Função:	Quando selecionada, deve permitir que o usuário digite texto que será 
incluído ao final da frase do item 4.
Caixa (b) : 
estado:     ativada
Texto:  		"Falar frase automaticamente". 
	Função: 	Quando selecionada a frase deve ser convertida automaticamente
quando disponível.

7 - Incluir um botão para limpar os cards e iniciar o aplicativo.
