import React, { Component } from 'react'
import axios from 'axios'
import './gallery.css'
import debounce from 'lodash.debounce'
import Thumbnail from '../thumbnail'
import UploadWindow from '../uploadWindow'
import Dropzone from '../dropzone'

const styles = {
    wrapper: {
        display: "flex",
        width: "90%",
        maxWidth: "960px",
        margin: "10px auto",
	}
}

class Gallery extends Component
{
	constructor()
	{
		super()

		this.state = {
			error: false,
			isLoading: false,
			cols: 3,
			currentIndex: 0,
			urls: [],
			images: [],
			dropzone: "none"
		}

		this.handleWindowResize = this.handleWindowResize.bind(this)
		this.toggleDropZone = this.toggleDropZone.bind(this)
		this.handleFiles = this.handleFiles.bind(this)

		window.onscroll = debounce(() => {
			const {
				state: {
				  error,
				  isLoading
				},
			  } = this;

			  if (error || isLoading) return;

			  if (
				window.innerHeight + document.documentElement.scrollTop
				=== document.documentElement.offsetHeight
			  ) {
				this.loadNextBatch();
			  }
		}, 100)
	}

	handleFiles(files)
	{
		// close the dropzone and upload files
		let data = new FormData()
		let file = files[0]
		data.append('photo', files[0])
		console.log(file.type)

		axios.post('http://localhost:5000/upload', data, {
				headers: {
					'Content-Type': file.type
				}
			})
			.then(res => {
				let file = res.data
				let images = this.state.images
				let l = this.state.currentIndex + 1
				images.unshift(<Thumbnail href={"http://localhost:5000/imgs/thumbnail/" + file} key={l} />)
				this.setState({
					images,
					currentIndex: l
				})
				this.toggleDropZone()
			})
			.catch(err => console.log(err))
	}

	handleWindowResize()
	{
		if (window.innerWidth >= 960) // tablet
			this.setState({
				cols: 3
			})
		else if (window.innerWidth < 960 && window.innerWidth > 480) // tablet
			this.setState({
				cols: 2
			})
		else
			this.setState({
				cols: 1
			})
	}

	toggleDropZone()
	{
		let dropzone = this.state.dropzone === "block" ? "none" : "block"
		this.setState({
			dropzone
		})
	}

	componentDidMount()
	{
		this.handleWindowResize()
		window.addEventListener("resize", this.handleWindowResize)
		this.fetchImages()
	}

	componentWillUnmount()
	{
		window.removeEventListener("resize", this.handleWindowResize)
	}
	 
	createGrid ()
	{
		let grid = [];
		for (let i = 0; i < this.state.cols; i++)
		{
			let col = []
			let images = this.state.images
			for (let j = i; j < this.state.images.length; j += this.state.cols)
			{
				col.push(images[j])
			}
			grid.push(<div className="column" key={''+i}>{ col }</div>)
		}

		return grid;
	}

	async fetchImages ()
	{
		let urls = this.state.urls
		await axios.get("http://localhost:5000/images").then(response => {
			let files = response.data

			files.forEach(file => {
				urls.push("http://localhost:5000/imgs/thumbnail/" + file)
			});

			this.setState({
				urls
			})
		})

		this.loadFirstBatch()
	}

	loadFirstBatch() {
		let index = this.state.currentIndex
		let images = this.state.images
		let urls = this.state.urls.slice(0, 29)

		urls.forEach(url => {
			images.push(<Thumbnail href={url} key={index} />)
			++index
			return true
		});

		this.setState({
			images: images,
			currentIndex: index
		})
	}

	loadNextBatch ()
	{
		let index = this.state.currentIndex
		let images = this.state.images
		let urls = this.state.urls.slice(index + 1, index + 7)

		urls.forEach(url => {
			images.push(<Thumbnail href={url} key={index} />)
			++index
			return true
		});

		this.setState({
			images: images,
			currentIndex: index
		})
	}

    render()
    {
        return(
            <div style={styles.wrapper}>
				<Dropzone display={this.state.dropzone} toggle={this.toggleDropZone} handleFiles={this.handleFiles} />
				{this.createGrid()}

				<UploadWindow toggle={this.toggleDropZone} />
            </div>
        )
    }
}

export default Gallery