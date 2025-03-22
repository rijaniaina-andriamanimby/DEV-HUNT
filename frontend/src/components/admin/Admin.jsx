import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

function Admin() {
    //Variable
    const [audio, setAudio] = useState([])
    const [titre, setTitre] = useState("")
    const [auteur, setAuteur] = useState("")
    const [niveau, setNiveau] = useState("")
    const [type, setType] = useState("")

    //Function
    const handleSend = () => {
        console.log(titre)
    }
  return (
    <div>
      <form action="">
        <div className="form-group">
            <label htmlFor="audio" className='form-label'>Audio :</label>
            <input type="file" name='audio' id='audio' className='form-control' onChange={(e)=>setAudio(e.target.value)} />
        </div>
        <div className="form-group">
            <label htmlFor="titre" className='form-label'>Titre :</label>
            <input type="text" name='titre' id='titre' className='form-control' onChange={(e)=>setTitre(e.target.value)}/>
        </div>
        <div className="form-group">
            <label htmlFor="auteur" className='form-label'>Auteur :</label>
            <input type="text" name='auteur' id='auteur' className='form-control' onChange={(e)=>setAuteur(e.target.value)}/>
        </div>
        <div className="form-group">
            <label htmlFor="niveau" className='form-label'>Niveau</label>
            <select name="niveau" id="niveau" className='form-select' onChange={(e)=>setNiveau(e.target.value)}>
                <option value="expert">Expert</option>
                <option value="debutant">Intermediaire</option>
                <option value="debutant">Débutant</option>
            </select>
        </div>
        <div className="form-group">
            <label htmlFor="type" className='form-label'>Type :</label>
            <input type="text" name='type' id='type' className='form-control' onChange={(e)=>setType(e.target.value)}/>
        </div>
        <div className="form-group mt-3">
            <button type="button" className='btn btn-outline-success' onClick={handleSend}>Ajouter</button>
            <button type="button" className='btn btn-outline-success'>Annuler</button>
        </div>
      </form>
    </div>
  )
}

export default Admin
