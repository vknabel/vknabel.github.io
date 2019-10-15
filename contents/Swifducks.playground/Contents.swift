public final class Store<State, Action> {
    public typealias Reducer = (Action, inout State) -> Void

    public private(set) var state: State
    private var reducers: [Reducer] = []
    private var callbacks: [Weak<Listener<State>>] = []

    public init(initial state: State) {
        self.state = state
    }

    public func select(_ changes: @escaping (State) -> Void) -> Any {
        let subscription = Listener(on: changes)
        callbacks.append(Weak(subscription))
        return subscription
    }

    private func reduce(with reducer: @escaping Reducer) {
        reducers.append(reducer)
    }

    public func dispatch(_ action: Action) {
        state = reducers.reduce(into: state) { intermediate, reducer in
            reducer(action, &intermediate)
        }
        callbacks = callbacks
            .compactMap { $0.value }
            .map(Weak.init)
        callbacks.forEach { $0.value?.onChange(state) }
    }
}

public extension Store {
    convenience init(initial state: State, reducer: @escaping Reducer) {
        self.init(initial: state)
        reduce(with: reducer)
    }
}

internal struct Weak<A: AnyObject> {
    weak var value: A?

    init(_ value: A?) {
        self.value = value
    }
}

internal final class Listener<State> {
    var onChange: (State) -> Void

    init(on change: @escaping (State) -> Void) {
        onChange = change
    }
}

enum IntAction {
    case increase
    case decrease
}

let root = Store<Int, IntAction>(initial: 0) { action, state in
    switch action {
    case .increase:
        state += 1
    case .decrease:
        state -= 1
    }
}

var sideEffect = -1
var listener: Any? = root.select {
    sideEffect = $0
}

root.dispatch(.increase)
root.state // will be 1
sideEffect // will be 1
listener = nil
root.dispatch(.decrease)
root.state // will be 0
sideEffect // will be 1
