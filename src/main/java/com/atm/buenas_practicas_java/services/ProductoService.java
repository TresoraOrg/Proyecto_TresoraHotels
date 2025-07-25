package com.atm.buenas_practicas_java.services;

import com.atm.buenas_practicas_java.entities.Producto;
import com.atm.buenas_practicas_java.repositories.ProductoRepo;
import com.atm.buenas_practicas_java.services.templateMethod.AbstractTemplateServicesEntities;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService extends AbstractTemplateServicesEntities<Producto, Integer, ProductoRepo> {

    public ProductoService(ProductoRepo productoRepo) {
        super(productoRepo);
    }

    public Optional<Producto> findByIdWithCategoria(Integer id) {
        return getRepo().findByIdWithCategoria(id);
    }

    public List<Producto> obtenerProductosActivos() {
        return getRepo().findAllByActivoTrue();
    }

    public List<Producto> obtenerProductosActivosPorCategoria(Integer idCategoria) {
        return getRepo().findAllByActivoTrueAndIdCategoria_Id(idCategoria);
    }

}
