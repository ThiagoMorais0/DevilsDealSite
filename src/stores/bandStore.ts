
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export interface Show {
    id?: number
    date: string
    time: string
    venue: string
    address: string
    ticketLinks: string[]
}

export interface Member {
    id?: number
    name: string
    role: string
    description: string
    instagram: string
    photos: string[]
}

export interface Product {
    id?: number
    name: string
    description: string
    price: number
    images: string[]
    colors: string[]
    sizes: string[]
}

export interface SiteConfig {
    id?: number
    logoUrl: string
    bannerImages: string[]
    aboutText: string
    stageMapUrl?: string
}

export interface TechnicalRiderItem {
    id?: number
    name: string
    quantity: number
    minimum: number
    alternative?: string
    observations?: string
    photos: string[]
}

export interface Photo {
    id: number
    album_id: number
    url: string
}

export interface Album {
    id: number
    title: string
    description: string
    cover_url: string
    photos?: Photo[]
}

export interface Song {
    id?: number
    title: string
    url: string
}

export const useBandStore = defineStore('band', () => {
    // State
    const config = ref<SiteConfig>({
        logoUrl: '',
        bannerImages: [],
        aboutText: ''
    })

    const shows = ref<Show[]>([])
    const members = ref<Member[]>([])
    const products = ref<Product[]>([])
    const albums = ref<Album[]>([])

    const songs = ref<Song[]>([])
    const technicalRider = ref<TechnicalRiderItem[]>([]) // New State
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Fetch Data
    const fetchData = async () => {
        isLoading.value = true
        error.value = null
        try {
            // Config
            const { data: configData } = await supabase.from('site_config').select('*').single()
            if (configData) {
                config.value = {
                    id: configData.id,
                    logoUrl: configData.logo_url,
                    aboutText: configData.about_text,
                    bannerImages: configData.banner_images || [],
                    stageMapUrl: configData.stage_map_url
                }
            }

            // Shows
            const { data: showsData } = await supabase.from('shows').select('*').order('date', { ascending: true })
            if (showsData) {
                shows.value = showsData.map(s => ({
                    id: s.id,
                    date: s.date,
                    time: s.time,
                    venue: s.venue,
                    address: s.address,
                    ticketLinks: s.ticket_links || []
                }))
            }

            // Members
            const { data: membersData } = await supabase.from('members').select('*').order('order_index', { ascending: true })
            if (membersData) {
                members.value = membersData.map(m => ({
                    id: m.id,
                    name: m.name,
                    role: m.role,
                    description: m.description,
                    instagram: m.instagram,
                    photos: m.photos || []
                }))
            }

            // Products
            const { data: productsData } = await supabase.from('products').select('*').order('id', { ascending: true })
            if (productsData) {
                products.value = productsData.map(p => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    price: parseFloat(p.price),
                    images: p.images || [],
                    colors: p.colors || [],
                    sizes: p.sizes || []
                }))
            }

            // Songs
            const { data: songsData } = await supabase.from('songs').select('*').order('created_at', { ascending: false })
            if (songsData) {
                songs.value = songsData
            }

            // Technical Rider
            const { data: riderData } = await supabase.from('technical_rider').select('*').order('name', { ascending: true })
            if (riderData) {
                technicalRider.value = riderData.map(r => ({
                    id: r.id,
                    name: r.name,
                    quantity: r.quantity,
                    minimum: r.minimum,
                    alternative: r.alternative,
                    observations: r.observations,
                    photos: r.photos || []
                }))
            }

        } catch (e: any) {
            console.error('Error fetching data:', e)
            error.value = e.message
        } finally {
            isLoading.value = false
        }
    }

    // Actions

    // --- Config & Banners ---
    const updateConfig = async () => {
        const payload = {
            logo_url: config.value.logoUrl,
            about_text: config.value.aboutText,
            banner_images: config.value.bannerImages, // Save all banners at once
            stage_map_url: config.value.stageMapUrl
        }

        if (config.value.id) {
            await supabase.from('site_config').update(payload).eq('id', config.value.id)
        } else {
            const { data } = await supabase.from('site_config').insert(payload).select().single()
            if (data) config.value.id = data.id
        }
    }

    const addBanner = async (url: string) => {
        // This action is now deprecated if banner_images is stored as an array in site_config
        // For now, we'll just update the local state and rely on updateConfig to save
        config.value.bannerImages.push(url)
        await updateConfig() // Save changes
    }

    const removeBanner = async (index: number) => {
        // This action is now deprecated if banner_images is stored as an array in site_config
        // For now, we'll just update the local state and rely on updateConfig to save
        config.value.bannerImages.splice(index, 1)
        await updateConfig() // Save changes
    }

    // --- Shows ---
    const addShow = async (show: Omit<Show, 'id'>) => {
        const payload = {
            date: show.date,
            time: show.time,
            venue: show.venue,
            address: show.address,
            ticket_links: show.ticketLinks
        }
        const { data, error: err } = await supabase.from('shows').insert(payload).select().single()
        if (err) {
            console.error('Error adding show:', err)
        } else if (data) {
            shows.value.push({ ...show, id: data.id })
        }
    }

    const removeShow = async (id: number) => {
        const { error: err } = await supabase.from('shows').delete().eq('id', id)
        if (err) {
            console.error('Error deleting show:', err)
        } else {
            shows.value = shows.value.filter(s => s.id !== id)
        }
    }

    const updateShow = async (updatedShow: Show) => {
        if (!updatedShow.id) return
        const payload = {
            date: updatedShow.date,
            time: updatedShow.time,
            venue: updatedShow.venue,
            address: updatedShow.address,
            ticket_links: updatedShow.ticketLinks
        }
        const { error: err } = await supabase.from('shows').update(payload).eq('id', updatedShow.id)
        if (err) {
            console.error('Error updating show:', err)
        } else {
            const index = shows.value.findIndex(s => s.id === updatedShow.id)
            if (index !== -1) shows.value[index] = updatedShow
        }
    }

    // --- Members ---
    const addMember = async (member: Omit<Member, 'id'>) => {
        const payload = {
            name: member.name,
            role: member.role,
            description: member.description,
            instagram: member.instagram,
            photos: member.photos,
            order_index: members.value.length // Add at the end
        }
        const { data, error: err } = await supabase.from('members').insert(payload).select().single()
        if (err) {
            console.error('Error adding member:', err)
        } else if (data) {
            members.value.push({ ...member, id: data.id })
        }
    }

    const removeMember = async (id: number) => {
        const { error: err } = await supabase.from('members').delete().eq('id', id)
        if (err) {
            console.error('Error deleting member:', err)
        } else {
            members.value = members.value.filter(m => m.id !== id)
        }
    }

    const updateMember = async (updatedMember: Member) => {
        if (!updatedMember.id) return
        const payload = {
            name: updatedMember.name,
            role: updatedMember.role,
            description: updatedMember.description,
            instagram: updatedMember.instagram,
            photos: updatedMember.photos
        }
        const { error: err } = await supabase.from('members').update(payload).eq('id', updatedMember.id)
        if (err) {
            console.error('Error updating member:', err)
        } else {
            const index = members.value.findIndex(m => m.id === updatedMember.id)
            if (index !== -1) members.value[index] = updatedMember
        }
    }

    const reorderMembers = async (newOrder: Member[]) => {
        // Optimistic update
        members.value = newOrder
        
        // Update database
        const updates = newOrder.map((member, index) => ({
            id: member.id,
            order_index: index
        }))

        // Supabase doesn't support bulk update easily in client, so we loop (or use upsert if we had all fields)
        // For simplicity and small lists, loop is acceptable. For larger, an RPC would be better.
        for (const update of updates) {
            await supabase.from('members').update({ order_index: update.order_index }).eq('id', update.id)
        }
    }

    // --- Products ---
    const addProduct = async (product: Omit<Product, 'id'>) => {
        const payload = {
            name: product.name,
            description: product.description,
            price: product.price,
            images: product.images,
            colors: product.colors,
            sizes: product.sizes
        }
        const { data, error: err } = await supabase.from('products').insert(payload).select().single()
        if (err) {
            console.error('Error adding product:', err)
        } else if (data) {
            products.value.push({ ...product, id: data.id })
        }
    }

    const removeProduct = async (id: number) => {
        const { error: err } = await supabase.from('products').delete().eq('id', id)
        if (err) {
            console.error('Error deleting product:', err)
        } else {
            products.value = products.value.filter(p => p.id !== id)
        }
    }

    const updateProduct = async (updatedProduct: Product) => {
        if (!updatedProduct.id) return
        const payload = {
            name: updatedProduct.name,
            description: updatedProduct.description,
            price: updatedProduct.price,
            images: updatedProduct.images,
            colors: updatedProduct.colors,
            sizes: updatedProduct.sizes
        }
        const { error: err } = await supabase.from('products').update(payload).eq('id', updatedProduct.id)
        if (err) {
            console.error('Error updating product:', err)
        } else {
            const index = products.value.findIndex(p => p.id === updatedProduct.id)
            if (index !== -1) products.value[index] = updatedProduct
        }
    }

    const uploadImage = async (file: File): Promise<string | null> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file)

        if (uploadError) {
            console.error('Error uploading image:', uploadError)
            return null
        }

        const { data } = supabase.storage.from('images').getPublicUrl(filePath)
        return data.publicUrl
    }

    // --- Songs Actions ---
    const addSong = async (song: Omit<Song, 'id'>) => {
        const { data, error: err } = await supabase.from('songs').insert(song).select().single()
        if (err) {
            console.error('Error adding song:', err)
        } else if (data) {
            songs.value.unshift(data)
        }
    }

    const removeSong = async (id: number) => {
        const { error: err } = await supabase.from('songs').delete().eq('id', id)
        if (err) {
            console.error('Error removing song:', err)
        } else {
            songs.value = songs.value.filter(s => s.id !== id)
        }

    }

    // --- Technical Rider Actions ---
    const addRiderItem = async (item: Omit<TechnicalRiderItem, 'id'>) => {
        const payload = {
            name: item.name,
            quantity: item.quantity,
            minimum: item.minimum,
            alternative: item.alternative,
            observations: item.observations,
            photos: item.photos
        }
        const { data, error: err } = await supabase.from('technical_rider').insert(payload).select().single()
        if (err) {
            console.error('Error adding rider item:', err)
        } else if (data) {
            technicalRider.value.push({ ...item, id: data.id })
        }
    }

    const removeRiderItem = async (id: number) => {
        const { error: err } = await supabase.from('technical_rider').delete().eq('id', id)
        if (err) {
            console.error('Error deleting rider item:', err)
        } else {
            technicalRider.value = technicalRider.value.filter(r => r.id !== id)
        }
    }

    const updateRiderItem = async (updatedItem: TechnicalRiderItem) => {
        if (!updatedItem.id) return
        const payload = {
            name: updatedItem.name,
            quantity: updatedItem.quantity,
            minimum: updatedItem.minimum,
            alternative: updatedItem.alternative,
            observations: updatedItem.observations,
            photos: updatedItem.photos
        }
        const { error: err } = await supabase.from('technical_rider').update(payload).eq('id', updatedItem.id)
        if (err) {
            console.error('Error updating rider item:', err)
        } else {
            const index = technicalRider.value.findIndex(r => r.id === updatedItem.id)
            if (index !== -1) technicalRider.value[index] = updatedItem
        }
    }

    // --- Gallery Actions ---

    const fetchGallery = async () => {
        try {
            const { data: albumsData, error: albumsError } = await supabase
                .from('albums')
                .select('*, photos(*)')
                .order('created_at', { ascending: false })

            if (albumsError) throw albumsError

            if (albumsData) {
                // Sort photos by order_index
                albumsData.forEach(album => {
                    if (album.photos) {
                        album.photos.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
                    }
                })
                albums.value = albumsData
            }
        } catch (err: any) {
            console.error('Error fetching gallery:', err)
        }
    }

    const createAlbum = async (album: Omit<Album, 'id' | 'photos'>) => {
        const { data, error: err } = await supabase.from('albums').insert(album).select().single()
        if (err) {
            console.error('Error creating album:', err)
        } else if (data) {
            albums.value.unshift({ ...data, photos: [] })
            return data
        }
    }

    const updateAlbum = async (id: number, updates: Partial<Album>) => {
        const { error: err } = await supabase.from('albums').update(updates).eq('id', id)
        if (err) {
            console.error('Error updating album:', err)
        } else {
            const index = albums.value.findIndex(a => a.id === id)
            if (index !== -1) {
                albums.value[index] = { ...albums.value[index], ...updates } as Album
            }
        }
    }

    const deleteAlbum = async (id: number) => {
        const { error: err } = await supabase.from('albums').delete().eq('id', id)
        if (err) {
            console.error('Error deleting album:', err)
        } else {
            albums.value = albums.value.filter(a => a.id !== id)
        }
    }

    const addPhotosToAlbum = async (albumId: number, urls: string[]) => {
        // Get current max order_index
        const album = albums.value.find(a => a.id === albumId)
        const currentMaxIndex = album?.photos?.length || 0

        const payload = urls.map((url, i) => ({ 
            album_id: albumId, 
            url,
            order_index: currentMaxIndex + i 
        }))
        const { data, error: err } = await supabase.from('photos').insert(payload).select()

        if (err) {
            console.error('Error adding photos:', err)
        } else if (data) {
            if (album) {
                if (!album.photos) album.photos = []
                album.photos.push(...data)
            }
        }
    }

    const removePhoto = async (photoId: number, albumId: number) => {
        const { error: err } = await supabase.from('photos').delete().eq('id', photoId)
        if (err) {
            console.error('Error deleting photo:', err)
        } else {
            const album = albums.value.find(a => a.id === albumId)
            if (album && album.photos) {
                album.photos = album.photos.filter(p => p.id !== photoId)
            }
        }
    }

    const reorderPhotos = async (albumId: number, newOrder: Photo[]) => {
        const album = albums.value.find(a => a.id === albumId)
        if (!album) return

        // Optimistic update
        album.photos = newOrder

        // Update database
        const updates = newOrder.map((photo, index) => ({
            id: photo.id,
            order_index: index
        }))

        for (const update of updates) {
            await supabase.from('photos').update({ order_index: update.order_index }).eq('id', update.id)
        }
    }

    // Initialize
    fetchData()
    fetchGallery()

    return {
        config,
        shows,
        members,
        products,
        albums,

        songs,
        technicalRider,
        isLoading,
        error,
        fetchData,
        uploadImage,
        // Config
        updateConfig,
        addBanner,
        removeBanner,
        // Shows
        addShow,
        removeShow,
        updateShow,
        // Members
        addMember,
        removeMember,
        updateMember,
        reorderMembers,
        // Products
        addProduct,
        removeProduct,
        updateProduct,
        // Gallery
        fetchGallery,
        createAlbum,
        updateAlbum,
        deleteAlbum,
        addPhotosToAlbum,
        removePhoto,
        reorderPhotos,
        // Songs
        addSong,

        removeSong,
        // Technical Rider
        addRiderItem,
        removeRiderItem,
        updateRiderItem,

        // Clear Actions
        clearBanners: async () => {
            config.value.bannerImages = []
            await updateConfig()
        },
        clearShows: async () => {
            const { error: err } = await supabase.from('shows').delete().neq('id', 0) // Delete all
            if (err) console.error('Error clearing shows:', err)
            else shows.value = []
        },
        clearMembers: async () => {
            const { error: err } = await supabase.from('members').delete().neq('id', 0)
            if (err) console.error('Error clearing members:', err)
            else members.value = []
        },
        clearProducts: async () => {
            const { error: err } = await supabase.from('products').delete().neq('id', 0)
            if (err) console.error('Error clearing products:', err)
            else products.value = []
        },
        clearAlbums: async () => {
            const { error: err } = await supabase.from('albums').delete().neq('id', 0)
            if (err) console.error('Error clearing albums:', err)
            else albums.value = []
        },
        clearSongs: async () => {
            const { error: err } = await supabase.from('songs').delete().neq('id', 0)
            if (err) console.error('Error clearing songs:', err)
            else songs.value = []
        },
        clearRiderItems: async () => {
            const { error: err } = await supabase.from('technical_rider').delete().neq('id', 0)
            if (err) console.error('Error clearing rider items:', err)
            else technicalRider.value = []
        }
    }
})
