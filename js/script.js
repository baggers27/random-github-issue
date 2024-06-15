
// https://docs.github.com/en/rest/search#search-issues-and-pull-requests
const sort_options = ['comments', 'reactions', 'reactions-+1', 'reactions--1', 'reactions-smile', 'reactions-thinking_face', 'reactions-heart', 'reactions-tada', 'interactions', 'created', 'updated']
const order_options = ['desc', 'asc']

let app = new Vue({
    el: '#app',
    data () {
        return {
            i: 0,
            response: null,
            language: null,
            error: null,
            loading: true,
            total: null,
            issue: {},
            message: "test",
            hasPrevious: false,
            prev: {}
        }
    },
    mounted () {
        this.search()
    },
    methods: {
        search() {
            this.loading = true;

            if (this.i === 0) {
                if (this.language) {
                    var params = {
                        params: {
                          q: 'is:issue is:open language:'+this.language,
                                     per_page: 100,
                            sort: sort_options[Math.floor(Math.random() * sort_options.length)],
                            order: order_options[Math.floor(Math.random() * order_options.length)],
                        }
                    };
                } else {
                    var params = {
                        params: {
                            q: 'is:issue is:open',
                               per_page: 100,
                            sort: sort_options[Math.floor(Math.random() * sort_options.length)],
                            order: order_options[Math.floor(Math.random() * order_options.length)],
                   
                        }
                    };
                }
                axios.get('https://api.github.com/search/issues', params)
                    .then(function (response) {
                        this.response = response;
                        this.setIssue(response);
                    }.bind(this))
                    .catch(function (error) {
                        this.error = error;
                    }.bind(this));
            } else {
                this.setIssue(this.response);
                if (this.i === 5) {
                    this.i = 0;
                }
            }
        },
        previous() {
            this.hasPrevious = false;

            this.issue = this.prev;
        },
        setIssue(response) {
            let issues = response.data.items;

            this.i = this.i+1;

            this.prev = this.issue;

            if (Object.keys(this.prev).length !== 0) {
                this.hasPrevious = true;
            }

            this.issue = issues[Math.floor(Math.random() * issues.length)];
            this.issue.repository = this.issue.html_url.split("/")[4];
            this.issue.created_at = new Date(this.issue.created_at).toJSON().slice(0,10);

            if (this.issue.body && this.issue.body.length > 350) {
                this.issue.body = this.issue.body.substring(0, 350)+"..";
            }

            this.total = response.data.total_count;

            this.loading = false;
        }
    }
})
