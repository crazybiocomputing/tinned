# Image Node.

The Image node injects any image format that is supported by Blender.

__TODO: Add a picture of node__

## Inputs

This node has no input sockets.

## Properties

### Image

Selection of different types of media. For controls see Data-Block Menu. For the options see Image Settings.

> Note: More options can be set in the Sidebar region.

## Outputs

The first two sockets are the minimum.

### Image

    Standard image output.
### Alpha

    Separate Alpha value.
### Z

    Z depth layer.

> Note: Multi-Layer Format. When a multi-layer file format, like `EXR`, is loaded, each layer is made available as a socket.
