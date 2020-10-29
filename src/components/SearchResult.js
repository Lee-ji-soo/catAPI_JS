class SearchResult {

    constructor({ $target, data, onBottom, onClickImg }) {
        this.data = data;
        this.$target = $target;
        this.$observer;
        this.onBottom = onBottom;
        this.onClickImg = onClickImg;

        //render cats
        this.$searchResult = document.createElement("ul");
        this.$searchResult.className = "SearchResult";
        this.$target.appendChild(this.$searchResult);
        this.page = data.page;

        //각 고양이 이미지
        this.$cat;

        const options = {
            rootMargin: "-100px",
            threshold: 1
        }

        this.observer = new IntersectionObserver((items) => { this.observe(items, options) })
    }

    lazyloading(item) {
        item.target.querySelector('img').src = item.target.querySelector('img').dataset.src;
    }

    observe(items) {
        items.forEach(item => {
            let dataIndex = Number(item.target.dataset.index);

            if (item.isIntersecting) {
                this.lazyloading(item);
                if (dataIndex + 1 === this.data.length) {
                    this.onBottom();
                }
            }
        })
    }

    setState(nextData) {
        this.page = nextData.page;

        if (this.page !== 1) {
            this.data = this.data.concat(nextData.items);
        } else {
            this.data = nextData.items
        }
        this.render();
    }

    render() {
        const htmlStr = this.data
            .map((cat, index) => `<li class='item' data-index=${index}>
                    <img data-src=${cat.url} alt=${cat.name} 
                    src='https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F2ChCI%2FbtqvPbkYHXS%2FBjoh4TSXHv66xRoiu6mrr1%2Fimg.gif'/>
                  </li>`)
            .join('');

        if (this.page === 1) {
            this.$searchResult.innerHTML = htmlStr;
        } else {
            this.$searchResult.insertAdjacentHTML('beforeEnd', htmlStr);
        }

        this.$cat = this.$searchResult.querySelectorAll('.item');
        this.addClickEvt();

        this.$cat.forEach(($item) => {
            this.observer.observe($item);
        })
    }

    addClickEvt() {
        this.$cat.forEach((cat, index) => {
            cat.addEventListener("click", () => {
                this.handleClick(this.data[index]);
            });
        });
    }

    handleClick(clickedItem) {
        this.onClickImg(clickedItem)
    }
}

export default SearchResult;
