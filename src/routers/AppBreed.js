import { Select, SearchResult, SearchInfo, Header, DarkMode, Loading } from '../components';
import { api } from '../utils/api.js';

class AppBreed {
    constructor({ $target }) {
        this.$target = $target;
        this.$header = document.createElement('header');
        this.$selectWrap = document.createElement('div');
        this.$main = document.createElement('main');
        this.$target.append(this.$header, this.$main);
        this.$main.appendChild(this.$selectWrap);

        this.state = {
            loading: false,
            onCategory: false,
            onBreed: false,
            onNone: true,
            clicked: {},
            infoIsVisible: false,
            path: 3,
        }

        this.breeds = [];
        this.categories = [];

        this.data = {
            items: [],
            breed: 'None',
            category: 0,
            page: 1,
        }

        this.searchResult;
        this.selectBreed;
        this.selectCategory;
        this.onSelect;

        this.init();
    };

    setState(nextData) {
        this.data = {
            ...this.data,
            items: nextData.items
        }

        this.isLoading.setState(false);

        this.searchResult.setState({
            ...this.data,
            items: nextData.items ? nextData.items : [],
            page: this.data.page
        });
    };

    mountComponent() {

        this.header = new Header({
            $target: this.$header
        })

        this.isLoading = new Loading({
            $target: this.$target,
            loading: this.state.loading
        })

        this.darkMode = new DarkMode({
            $target: this.$target,
        })

        this.searchResult = new SearchResult({
            $target: this.$main,
            data: this.data.items,
            onBottom: () => { this.onBottom(this.fetchMoreCat) },
            onClickImg: (data) => { this.onClickImg(data) }
        });

        this.searchInfo = new SearchInfo({
            $target: this.$main,
            data: this.state
        })

    }

    mountBreedSelect() {
        this.selectBreed = new Select({
            $app: this.$target,
            $target: this.$selectWrap,
            selections: this.breeds,
            title: 'Breed',
            onSelectBreed: (selected) => { this.onSelectBreed(selected) },
        })
    }

    mountInitialCat() {
        this.fetchInitialBreeds();
    }

    init() {
        this.mountInitialCat();
        this.mountComponent();
        this.setPath();
        this.render();
    };

    render() {
        this.searchResult.setState({ page: 1, items: [] });
    }

    setPath() {
        this.header.setState(this.state.path);
    }

    onBottom() {
        this.data.page = this.data.page + 1;
        this.fetchMoreCat(this.data)
    }

    onClickImg(data) {
        if (this.state.onBreed) {
            this.searchInfo.setState({
                ...this.state,
                clicked: data,
                infoIsVisible: true
            });
        }
    }

    onSelectBreed(selected) {
        this.isLoading.setState(true);
        this.data.breed = selected;
        this.fetchBreed({ breed: this.data.breed });
    }

    async fetchMoreCat(data = this.data, state = this.state) {
        const cats = await api.fetchMoreCat(data, state);
        if (cats.length > 1) {
            this.searchResult.setState({
                ...this.data,
                items: cats ? cats : [],
                page: this.data.page
            });
        }
    }

    async fetchCat(data = this.data) {
        const cats = await api.fetchCats(data);
        await this.setState({
            ...this.data,
            items: cats ? cats : []
        });
    }

    async fetchInitialBreeds() {
        const breeds = await api.fetchInitialBreeds();
        this.breeds = breeds;
        this.mountBreedSelect();
    }

    async fetchBreed({ breed }) {
        this.state = {
            ...this.state,
            onCategory: false,
            onBreed: true,
            onNone: false,
        }
        this.data = {
            ...this.data,
            page: 1
        }
        const cats = await api.fetchBreed(breed);
        await this.setState({
            ...this.data,
            items: cats ? cats : []
        })
    }

}
export default AppBreed;

