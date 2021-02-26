using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PeliculasAPI.Utilidades
{
    public class AlmacenadorAzureStorage : IAlmacenadorArchivos
    {
        private readonly string connectionString;

        public AlmacenadorAzureStorage(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("AzureStorage");
        }

        private async Task<BlobContainerClient> GetClient(string container)
        {
            // Conectando el cliente y creando el contenedor si no existe
            var client = new BlobContainerClient(connectionString, container);
            await client.CreateIfNotExistsAsync();
            client.SetAccessPolicy(Azure.Storage.Blobs.Models.PublicAccessType.Blob);

            return client;
        }

        public async Task<string> GuardarArchivo(string container, IFormFile file)
        {
            var client = await GetClient(container);

            // Creando el nombre del archivo nuevo a guardar
            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";

            // Subiendo el archivo a Azure Storage
            var blob = client.GetBlobClient(fileName);
            await blob.UploadAsync(file.OpenReadStream());

            // Retornar la URL del archivo subido
            return blob.Uri.ToString();
        }

        public async Task BorrarArchivo(string fileRoute, string container)
        {
            if (string.IsNullOrEmpty(fileRoute))
            {
                return;
            }

            var client = await GetClient(container);
            var fileName = Path.GetFileName(fileRoute);
            var blob = client.GetBlobClient(fileName);
            await blob.DeleteIfExistsAsync();
        }

        public async Task<string> EditarArchivo(string container, IFormFile file, string fileRoute)
        {
            await BorrarArchivo(fileRoute, container);
            return await GuardarArchivo(container, file);
        }
    }
}
