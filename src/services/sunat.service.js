export const getRucInfo = async (ruc) => {
  try {
    const res = await fetch(`https://api.apis.net.pe/v1/ruc?numero=${ruc}`, {
      headers: {
        Authorization: `Bearer ${process.env.APIS_NET_PE_TOKEN}`
      }
    })
    const data = await res.json()
    if (!res.ok) throw new Error('RUC no encontrado')
    return {
      razon_social: data.razonSocial,
      estado: data.estado,
      condicion: data.condicion,
      tipo: data.tipoContribuyente
    }
  } catch (err) {
    console.error('SUNAT error:', err.message)
    throw new Error('No se pudo validar el RUC con SUNAT')
  }
}
